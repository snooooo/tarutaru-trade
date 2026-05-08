import {
  createPublicSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import type { PublicTradePost } from "@/lib/types/trade-posts";

type LooseSupabase = {
  auth?: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: { message: string } | null;
    }>;
  };
  from: (table: string) => {
    select: (columns: string, options?: { count?: "exact" | "planned" }) => {
      in: (
        column: string,
        values: string[],
      ) => Promise<{
        data: unknown[] | null;
        error: { message: string } | null;
      }>;
      eq: (
        column: string,
        value: string,
      ) => {
        in?: (
          column: string,
          values: string[],
        ) => Promise<{
          data: unknown[] | null;
          error: { message: string } | null;
        }>;
        order: (
          column: string,
          options?: { ascending?: boolean },
        ) => Promise<{
          data: unknown[] | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

type LikeRow = { trade_post_id: string };
type LikeCountRow = { trade_post_id: string };
type MyLikeRow = { trade_post_id: string; created_at: string };

/**
 * 表示中の投稿IDセットに対するいいね数を一括取得。
 * RLS により誰でも SELECT 可能。
 */
export async function getLikeCountsByPostIds(
  postIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (!postIds.length) return counts;

  const supabase = createPublicSupabaseClient();
  if (!supabase) return counts;

  const loose = supabase as unknown as LooseSupabase;
  const { data, error } = await loose
    .from("trade_likes")
    .select("trade_post_id")
    .in("trade_post_id", postIds);

  if (error || !data) return counts;

  for (const row of data as LikeCountRow[]) {
    counts.set(row.trade_post_id, (counts.get(row.trade_post_id) ?? 0) + 1);
  }
  return counts;
}

/**
 * 表示中の投稿IDのうち、現在のユーザーがいいね済みの集合を取得。
 * 未ログインの場合は空集合。
 */
export async function getMyLikedPostIdSet(
  postIds: string[],
): Promise<Set<string>> {
  const set = new Set<string>();
  if (!postIds.length) return set;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return set;

  const loose = supabase as unknown as LooseSupabase;
  const {
    data: { user },
  } = (await loose.auth!.getUser()) ?? { data: { user: null } };
  if (!user) return set;

  const eqQuery = loose
    .from("trade_likes")
    .select("trade_post_id")
    .eq("user_id", user.id);
  const result = await eqQuery.in!("trade_post_id", postIds);
  const data = result.data as LikeRow[] | null;
  if (!data) return set;

  for (const row of data) set.add(row.trade_post_id);
  return set;
}

/**
 * 単一投稿の (count, liked) を取得。詳細ページ用。
 */
export async function getLikeStatusForPost(
  postId: string,
): Promise<{ count: number; liked: boolean }> {
  const counts = await getLikeCountsByPostIds([postId]);
  const liked = (await getMyLikedPostIdSet([postId])).has(postId);
  return { count: counts.get(postId) ?? 0, liked };
}

/**
 * マイページ /mypage/likes 用: 現在のユーザーがいいねした投稿を、
 * いいね日時(created_at)の降順で取得。
 */
export async function getMyLikedTradePosts(): Promise<{
  data: PublicTradePost[];
  error: string | null;
  isConfigured: boolean;
}> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }
  const loose = supabase as unknown as LooseSupabase;

  const {
    data: { user },
  } = await loose.auth!.getUser();
  if (!user) {
    return { data: [], error: null, isConfigured: true };
  }

  // 1. 自分のいいね一覧 (新しい順)
  const likesResult = await loose
    .from("trade_likes")
    .select("trade_post_id,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (likesResult.error) {
    return { data: [], error: likesResult.error.message, isConfigured: true };
  }
  const likeRows = (likesResult.data ?? []) as MyLikeRow[];
  if (!likeRows.length) {
    return { data: [], error: null, isConfigured: true };
  }
  const orderedPostIds = likeRows.map((r) => r.trade_post_id);

  // 2. 該当投稿を public view から取得 (匿名化済み)
  const publicClient = createPublicSupabaseClient();
  if (!publicClient) {
    return { data: [], error: null, isConfigured: false };
  }
  const loosePub = publicClient as unknown as LooseSupabase;
  const postsResult = await loosePub
    .from("trade_public_posts")
    .select("*")
    .in("id", orderedPostIds);

  if (postsResult.error) {
    return { data: [], error: postsResult.error.message, isConfigured: true };
  }

  const byId = new Map<string, PublicTradePost>();
  for (const row of (postsResult.data ?? []) as PublicTradePost[]) {
    byId.set(row.id, {
      ...row,
      offer_items: Array.isArray(row.offer_items) ? row.offer_items : [],
      want_items: Array.isArray(row.want_items) ? row.want_items : [],
    });
  }

  // いいね日時順を保ったまま並べ替え。
  // private 等で view から消えた投稿はスキップ。
  const data = orderedPostIds
    .map((id) => byId.get(id))
    .filter((p): p is PublicTradePost => Boolean(p));

  return { data, error: null, isConfigured: true };
}
