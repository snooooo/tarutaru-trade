"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function redirectPasswordWithError(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`/settings/account/password?${params.toString()}`);
}

export async function updatePasswordAction(formData: FormData) {
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!newPassword || newPassword.length < 8) {
    redirectPasswordWithError("パスワードは8文字以上で設定してください。");
  }
  if (!/(?=.*[a-z])(?=.*[0-9])/.test(newPassword)) {
    redirectPasswordWithError("パスワードは英字と数字を含める必要があります。");
  }
  if (newPassword !== confirmPassword) {
    redirectPasswordWithError("パスワードが一致しません。");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirectPasswordWithError("Supabase環境変数が未設定です。");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    redirectPasswordWithError("パスワードの更新に失敗しました。時間をおいて再度お試しください。");
  }

  redirect("/settings/account/password?updated=1");
}

function redirectWithError(message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`/settings/account/delete?${params.toString()}`);
}

export async function deleteAccountAction(formData: FormData) {
  const confirmation = String(formData.get("confirmation") ?? "").trim();
  if (confirmation !== "退会する") {
    redirectWithError("確認のため「退会する」と入力してください。");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirectWithError("Supabase環境変数が未設定です。");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login?next=/settings/account/delete");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    redirectWithError("Supabase環境変数が未設定です。");
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/trade-delete-account`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let message = "退会処理に失敗しました。時間をおいて再度お試しください。";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    redirectWithError(message);
  }

  await supabase.auth.signOut();
  redirect("/?account_deleted=1");
}
