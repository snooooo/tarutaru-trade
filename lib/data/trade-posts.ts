import { createPublicSupabaseClient } from "@/lib/supabase/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  MyTradePost,
  PublicTradePost,
  PublicTradePostOfferItem,
  PublicTradePostWantItem,
  TradePostStatus,
} from "@/lib/types/trade-posts";

const PAGE_SIZE = 24;

type QueryResult<T> = {
  data: T[];
  error: string | null;
  isConfigured: boolean;
};

type PostgrestError = {
  message: string;
};

type PostgrestListResult = {
  data: unknown[] | null;
  error: PostgrestError | null;
};

type PostgrestSingleResult = {
  data: unknown | null;
  error: PostgrestError | null;
};

type PublicPostsQuery = {
  order: (column: string, options?: { ascending?: boolean }) => PublicPostsQuery;
  limit: (count: number) => PublicPostsQuery;
  eq: (column: string, value: string) => PublicPostsQuery;
  or: (filters: string) => PublicPostsQuery;
  maybeSingle: () => Promise<PostgrestSingleResult>;
};

type LooseSupabase = {
  from: (table: "trade_public_posts") => {
    select: (columns: string) => PublicPostsQuery;
  };
};

type LooseServerSupabase = {
  auth: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: { message: string } | null;
    }>;
  };
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        order: (
          column: string,
          options?: { ascending?: boolean },
        ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
      };
      in: (
        column: string,
        values: string[],
      ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
    };
  };
};

type MyTradePostRow = {
  admin_hidden_at: string | null;
  admin_hidden_by: string | null;
  admin_hidden_reason: string | null;
  id: string;
  title: string | null;
  condition_note: string | null;
  status: TradePostStatus;
  created_at: string;
  published_at: string | null;
  closed_at: string | null;
};

type MyOfferRow = PublicTradePostOfferItem & {
  trade_post_id: string;
  status?: string | null;
};

type MyWantRow = PublicTradePostWantItem & {
  trade_post_id: string;
  status?: string | null;
};

function ilikePattern(query?: string) {
  const trimmed = query?.trim();
  return trimmed ? `%${trimmed}%` : null;
}

function publicPostsClient() {
  const supabase = createPublicSupabaseClient();
  return supabase ? (supabase as unknown as LooseSupabase) : null;
}

async function executeList(
  query: PublicPostsQuery,
): Promise<PostgrestListResult> {
  return query as unknown as Promise<PostgrestListResult>;
}

function normalizePost(row: unknown): PublicTradePost {
  const post = row as PublicTradePost;

  return {
    ...post,
    offer_items: Array.isArray(post.offer_items) ? post.offer_items : [],
    want_items: Array.isArray(post.want_items) ? post.want_items : [],
  };
}

export async function getPublicTradePosts(options?: {
  limit?: number;
  query?: string;
}): Promise<QueryResult<PublicTradePost>> {
  const supabase = publicPostsClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const pattern = ilikePattern(options?.query);
  let request = supabase
    .from("trade_public_posts")
    .select("*")
    .order("is_closed", { ascending: true })
    .order("published_at", { ascending: false })
    .limit(options?.limit ?? PAGE_SIZE);

  if (pattern) {
    request = request.or(`search_text.ilike.${pattern}`);
  }

  const { data, error } = await executeList(request);

  return {
    data: (data ?? []).map(normalizePost),
    error: error?.message ?? null,
    isConfigured: true,
  };
}

export async function getPublicTradePost(
  postId: string,
): Promise<QueryResult<PublicTradePost>> {
  const supabase = publicPostsClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const { data, error } = await supabase
    .from("trade_public_posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  return {
    data: data ? [normalizePost(data)] : [],
    error: error?.message ?? null,
    isConfigured: true,
  };
}

function normalizeMyOffer(row: MyOfferRow): PublicTradePostOfferItem {
  return {
    id: row.id,
    maltperi_bottle_id: row.maltperi_bottle_id,
    manual_bottle_name: row.manual_bottle_name,
    display_bottle_name: row.display_bottle_name ?? row.manual_bottle_name,
    bottle_name: row.bottle_name,
    brand_name: row.brand_name,
    country: row.country,
    category: row.category,
    distillery_name_ja: row.distillery_name_ja,
    distillery_id: row.distillery_id,
    distillery_area: row.distillery_area,
    median_price: row.median_price,
    price_sample_count: row.price_sample_count,
    box_condition: row.box_condition,
    label_condition: row.label_condition,
    image_url: row.image_url,
    note: row.note,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function normalizeMyWant(row: MyWantRow): PublicTradePostWantItem {
  return {
    id: row.id,
    maltperi_bottle_id: row.maltperi_bottle_id,
    manual_bottle_name: row.manual_bottle_name,
    display_bottle_name: row.display_bottle_name ?? row.manual_bottle_name,
    bottle_name: row.bottle_name,
    brand_name: row.brand_name,
    country: row.country,
    category: row.category,
    distillery_name_ja: row.distillery_name_ja,
    distillery_id: row.distillery_id,
    distillery_area: row.distillery_area,
    median_price: row.median_price,
    price_sample_count: row.price_sample_count,
    condition_note: row.condition_note,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

export async function getMyTradePosts(): Promise<QueryResult<MyTradePost>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const loose = supabase as unknown as LooseServerSupabase;
  const {
    data: { user },
    error: userError,
  } = await loose.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError?.message ?? null, isConfigured: true };
  }

  const postResult = await loose
    .from("trade_posts")
    .select(
      "id,title,condition_note,status,created_at,published_at,closed_at,admin_hidden_at,admin_hidden_by,admin_hidden_reason",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const postRows = (postResult.data ?? []) as MyTradePostRow[];
  const postIds = postRows.map((post) => post.id);

  if (postResult.error || !postIds.length) {
    return {
      data: [],
      error: postResult.error?.message ?? null,
      isConfigured: true,
    };
  }

  const [offerResult, wantResult] = await Promise.all([
    loose
      .from("trade_offer_items")
      .select(
        "id,trade_post_id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,sort_order,created_at",
      )
      .in("trade_post_id", postIds),
    loose
      .from("trade_want_items")
      .select(
        "id,trade_post_id,maltperi_bottle_id,manual_bottle_name,condition_note,status,sort_order,created_at",
      )
      .in("trade_post_id", postIds),
  ]);

  const offersByPost = new Map<string, PublicTradePostOfferItem[]>();
  for (const row of (offerResult.data ?? []) as MyOfferRow[]) {
    const items = offersByPost.get(row.trade_post_id) ?? [];
    items.push(normalizeMyOffer(row));
    offersByPost.set(row.trade_post_id, items);
  }

  const wantsByPost = new Map<string, PublicTradePostWantItem[]>();
  for (const row of (wantResult.data ?? []) as MyWantRow[]) {
    const items = wantsByPost.get(row.trade_post_id) ?? [];
    items.push(normalizeMyWant(row));
    wantsByPost.set(row.trade_post_id, items);
  }

  const posts = postRows.map((post) => ({
    ...post,
    offer_items: (offersByPost.get(post.id) ?? []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
    want_items: (wantsByPost.get(post.id) ?? []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
  }));

  return {
    data: posts,
    error: offerResult.error?.message ?? wantResult.error?.message ?? null,
    isConfigured: true,
  };
}

export async function getMyTradePost(
  postId: string,
): Promise<QueryResult<MyTradePost>> {
  const result = await getMyTradePosts();

  if (result.error || !result.data.length) {
    return result;
  }

  return {
    ...result,
    data: result.data.filter((post) => post.id === postId),
  };
}
