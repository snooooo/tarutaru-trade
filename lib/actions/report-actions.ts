"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/require-user";

export type ReportState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

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
  if (!admin) return;

  await admin
    .from("trade_reports")
    .update({ status: "resolved" })
    .eq("id", reportId);

  revalidatePath("/admin/reports");
}
