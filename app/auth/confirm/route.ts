import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_TYPES: EmailOtpType[] = [
  "signup",
  "magiclink",
  "recovery",
  "invite",
  "email_change",
  "email",
];

function safeNext(value: string | null) {
  if (!value) return "/settings/profile";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/settings/profile";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const typeParam = requestUrl.searchParams.get("type");
  const next = safeNext(requestUrl.searchParams.get("next"));

  const type = ALLOWED_TYPES.includes(typeParam as EmailOtpType)
    ? (typeParam as EmailOtpType)
    : null;

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("確認リンクが無効です。")}`, requestUrl.origin),
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Supabase環境変数が未設定です。")}`, requestUrl.origin),
    );
  }

  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) {
    console.error("Auth confirm error:", error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
