"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getMyTradeProfile } from "@/lib/data/profiles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseProfileForm } from "@/lib/validators/profile";

function safeNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "").trim();

  return next.startsWith("/") && !next.startsWith("//") ? next : "/settings/profile";
}

export async function upsertTradeProfileAction(formData: FormData) {
  const next = safeNextPath(formData.get("next"));
  const user = await requireUser("/settings/profile");
  const supabase = await createServerSupabaseClient();
  const { profile } = await getMyTradeProfile();
  const { values, errors } = parseProfileForm(formData);

  if (!supabase) {
    redirect("/settings/profile?error=Supabase環境変数が未設定です。");
  }

  if (errors.length) {
    const params = new URLSearchParams({
      error: errors[0],
      next,
    });
    redirect(`/settings/profile?${params.toString()}`);
  }

  const now = new Date().toISOString();
  const termsAcceptedAt = values.termsAccepted
    ? (profile?.terms_accepted_at ?? now)
    : null;

  const { error } = await supabase.from("trade_profiles").upsert({
    user_id: user.id,
    display_name: values.displayName,
    x_id: values.xId,
    x_followers_range: values.xFollowersRange,
    anonymous_shipping_ok: values.anonymousShippingOk,
    terms_accepted_at: termsAcceptedAt,
    updated_at: now,
  });

  if (error) {
    const params = new URLSearchParams({
      error: error.message,
      next,
    });
    redirect(`/settings/profile?${params.toString()}`);
  }

  redirect(`${next}?profile_saved=1`);
}
