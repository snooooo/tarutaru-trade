import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  console.log(
    "[proxy] incoming",
    request.nextUrl.pathname,
    "cookies:",
    request.cookies.getAll().map((c) => c.name),
  );

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        console.log(
          "[proxy] setAll on",
          request.nextUrl.pathname,
          "cookies:",
          cookiesToSet.map((c) => c.name),
        );
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  console.log(
    "[proxy] getUser on",
    request.nextUrl.pathname,
    "userId=",
    data.user?.id ?? null,
    "error=",
    error?.message ?? null,
  );

  return response;
}
