"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function redirectWithError(path: string, message: string, next?: string): never {
  const params = new URLSearchParams({ error: message });

  if (next) {
    params.set("next", next);
  }

  redirect(`${path}?${params.toString()}`);
}

function safeNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "").trim();

  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function loginAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!supabase) {
    redirectWithError("/login", "Supabase環境変数が未設定です。", next);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError("/login", "メールアドレスまたはパスワードを確認してください。", next);
  }

  redirect(next);
}

export async function signupAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next")) || "/settings/profile";

  if (!supabase) {
    redirectWithError("/signup", "Supabase環境変数が未設定です。", next);
  }

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        "/settings/profile",
      )}`,
    },
  });

  if (error) {
    redirectWithError("/signup", error.message, next);
  }

  redirect(`/settings/profile?next=${encodeURIComponent(next)}&signup=1`);
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/");
}
