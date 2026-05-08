"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/require-user";

export type ToggleLikeResult =
  | { status: "ok"; liked: boolean }
  | { status: "error"; message: string };

export async function toggleLikeAction(
  postId: string,
): Promise<ToggleLikeResult> {
  if (!postId) {
    return { status: "error", message: "投稿が指定されていません。" };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "ログインが必要です。" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { status: "error", message: "Supabase環境変数が未設定です。" };
  }

  type LooseAuthSupabase = {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (
          column: string,
          value: string,
        ) => {
          eq: (
            column: string,
            value: string,
          ) => {
            maybeSingle: () => Promise<{
              data: unknown | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
      insert: (
        values: Record<string, unknown>,
      ) => Promise<{ error: { code?: string; message: string } | null }>;
      delete: () => {
        eq: (
          column: string,
          value: string,
        ) => {
          eq: (
            column: string,
            value: string,
          ) => Promise<{ error: { message: string } | null }>;
        };
      };
    };
    rpc?: unknown;
  };
  const loose = supabase as unknown as LooseAuthSupabase;

  // 既にいいね済みかを確認
  const existing = await loose
    .from("trade_likes")
    .select("trade_post_id")
    .eq("user_id", user.id)
    .eq("trade_post_id", postId)
    .maybeSingle();

  if (existing.error) {
    return { status: "error", message: existing.error.message };
  }

  if (existing.data) {
    // 解除
    const { error } = await loose
      .from("trade_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("trade_post_id", postId);
    if (error) {
      return { status: "error", message: error.message };
    }
    revalidatePath("/posts");
    revalidatePath(`/posts/${postId}`);
    revalidatePath("/mypage/likes");
    return { status: "ok", liked: false };
  }

  // 新規追加 (closed 投稿では新規いいねは UI 側でブロックする想定だが、
  // サーバー側でも厳密に弾きたい場合は trade_posts.status をチェック)
  const { error } = await loose.from("trade_likes").insert({
    user_id: user.id,
    trade_post_id: postId,
  });
  if (error) {
    if (error.code === "23505") {
      // 競合: 既にある状態なので liked=true として返す
      return { status: "ok", liked: true };
    }
    return { status: "error", message: error.message };
  }
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/mypage/likes");
  return { status: "ok", liked: true };
}
