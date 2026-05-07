import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("Supabase環境変数が未設定です。")}`,
        requestUrl.origin,
      ),
    );
  }

  // Cookieをこのレスポンスに直接書くため、先に成功時のレスポンスを作る
  const next = overrideNext ?? DEFAULT_NEXT_BY_TYPE[type] ?? "/mypage";
  const response = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient<Database>(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) {
    console.error("Auth confirm error:", error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
    );
  }

  return response;
}
