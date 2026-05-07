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

const DEFAULT_NEXT_BY_TYPE: Record<EmailOtpType, string> = {
  signup: "/settings/profile",
  magiclink: "/mypage",
  recovery: "/settings/account/password",
  invite: "/settings/profile",
  email_change: "/settings/profile",
  email: "/mypage",
};

function safeNext(value: string | null) {
  if (!value) return null;
  return value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const typeParam = requestUrl.searchParams.get("type");
  const overrideNext = safeNext(requestUrl.searchParams.get("next"));

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

  const next = overrideNext ?? DEFAULT_NEXT_BY_TYPE[type] ?? "/mypage";
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
