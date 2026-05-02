import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/offers") ||
    pathname.startsWith("/wants") ||
    pathname.startsWith("/mypage/offers") ||
    pathname.startsWith("/mypage/wants")
  ) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname.startsWith("/mypage/offers") || pathname.startsWith("/mypage/wants")
        ? "/mypage/posts/new"
        : "/posts";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
