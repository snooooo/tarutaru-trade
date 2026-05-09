"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/require-user";
import { revalidateAdminPostPaths } from "@/lib/actions/admin-post-actions";

export type ReportState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

type AdminReportSupabase = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        maybeSingle: () => Promise<{
          data: { status: string; admin_hidden_at: string | null } | null;
          error: { message: string } | null;
        }>;
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (
        column: string,
        value: string,
      ) => {
        is?: (
          column: string,
          value: null,
        ) => Promise<{ error: { message: string } | null }>;
      } & Promise<{ error: { message: string } | null }>;
    };
  };
};

function reportRedirectWithError(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`/admin/reports?${params.toString()}`);
}

function reportAdminNote(formData: FormData) {
  const value = formData.get("admin_hidden_reason");
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function createReportAction(
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "ログインが必要です。" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { status: "error", message: "Supabase環境変数が未設定です。" };
  }

  const postId = formData.get("trade_post_id");
  if (typeof postId !== "string" || !postId) {
    return { status: "error", message: "投稿が見つかりません。" };
  }

  const reason = formData.get("reason");
  const reasonValue = typeof reason === "string" && reason.trim() ? reason.trim() : null;

  const loose = supabase as unknown as {
    from: (table: string) => {
      insert: (values: Record<string, unknown>) => Promise<{ error: { code?: string; message: string } | null }>;
    };
  };

  const { error } = await loose.from("trade_reports").insert({
    reporter_user_id: user.id,
    trade_post_id: postId,
    reason: reasonValue,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", message: "この投稿はすでに通報済みです。" };
    }
    return { status: "error", message: error.message };
  }

  return { status: "success" };
}

export async function resolveReportAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const reportId = formData.get("report_id");
  if (typeof reportId !== "string" || !reportId) return;

  const admin = createAdminSupabaseClient();
  if (!admin) {
    reportRedirectWithError("管理者用Supabase環境変数が未設定です。");
  }

  const { error } = await admin
    .from("trade_reports")
    .update({ status: "resolved" })
    .eq("id", reportId);

  if (error) {
    reportRedirectWithError(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  redirect("/admin/reports?updated=resolved");
}

export async function resolveAndHidePostAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const reportId = formData.get("report_id");
  const postId = formData.get("trade_post_id");
  if (typeof reportId !== "string" || !reportId) {
    reportRedirectWithError("通報が見つかりません。");
  }
  if (typeof postId !== "string" || !postId) {
    reportRedirectWithError("投稿が見つかりません。");
  }

  const admin = createAdminSupabaseClient();
  if (!admin) {
    reportRedirectWithError("管理者用Supabase環境変数が未設定です。");
  }

  const loose = admin as unknown as AdminReportSupabase;
  const { data: post, error: postError } = await loose
    .from("trade_posts")
    .select("status,admin_hidden_at")
    .eq("id", postId)
    .maybeSingle();

  if (postError || !post) {
    reportRedirectWithError(postError?.message ?? "投稿が見つかりません。");
  }
  if (post.admin_hidden_at) {
    reportRedirectWithError("この投稿はすでに管理者非公開です。");
  }
  if (post.status !== "public" && post.status !== "closed") {
    reportRedirectWithError("公開中または終了済みの投稿だけ管理者非公開にできます。");
  }

  const postValues: Record<string, unknown> = {
    admin_hidden_at: new Date().toISOString(),
    admin_hidden_by: user.id,
    admin_hidden_reason: reportAdminNote(formData),
  };
  if (post.status === "public") {
    postValues.status = "private";
  }

  const postUpdate = loose
    .from("trade_posts")
    .update(postValues)
    .eq("id", postId);
  const postResult = postUpdate.is
    ? await postUpdate.is("admin_hidden_at", null)
    : await postUpdate;

  if (postResult.error) {
    reportRedirectWithError(postResult.error.message);
  }

  const reportResult = await loose
    .from("trade_reports")
    .update({
      status: "resolved",
      admin_note: reportAdminNote(formData),
    })
    .eq("id", reportId);

  if (reportResult.error) {
    reportRedirectWithError(reportResult.error.message);
  }

  await revalidateAdminPostPaths(postId);
  redirect("/admin/reports?updated=hidden_and_resolved");
}
