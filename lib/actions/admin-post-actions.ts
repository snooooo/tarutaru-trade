"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";

type AdminPostUpdateSupabase = {
  from: (table: "trade_posts") => {
    update: (values: {
      status: "private";
      admin_hidden_at: string;
      admin_hidden_by: string;
      admin_hidden_reason: string | null;
    }) => {
      eq: (
        column: string,
        value: string,
      ) => {
        is: (
          column: string,
          value: null,
        ) => Promise<{ error: { message: string } | null }>;
      };
    };
  };
};

function redirectWithAdminPostError(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`/admin/posts?${params.toString()}`);
}

function adminReason(formData: FormData) {
  const value = formData.get("admin_hidden_reason");
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function revalidateAdminPostPaths(postId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/reports");
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/mypage");
  revalidatePath("/mypage/likes");
}

export async function adminHidePostAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const postId = formData.get("post_id");
  if (typeof postId !== "string" || !postId) {
    redirectWithAdminPostError("投稿が見つかりません。");
  }

  const admin = createAdminSupabaseClient();
  if (!admin) {
    redirectWithAdminPostError("管理者用Supabase環境変数が未設定です。");
  }

  const { error } = await (admin as unknown as AdminPostUpdateSupabase)
    .from("trade_posts")
    .update({
      status: "private",
      admin_hidden_at: new Date().toISOString(),
      admin_hidden_by: user.id,
      admin_hidden_reason: adminReason(formData),
    })
    .eq("id", postId)
    .is("admin_hidden_at", null);

  if (error) {
    redirectWithAdminPostError(error.message);
  }

  await revalidateAdminPostPaths(postId);
  redirect("/admin/posts?updated=admin_hidden");
}
