import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getMyTradeProfile } from "@/lib/data/profiles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CompleteTradeProfile } from "@/lib/types/profile";
import { isCompleteTradeProfile } from "@/lib/validators/profile";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(nextPath: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export async function requireCompleteTradeProfile(
  nextPath: string,
): Promise<{ user: User; profile: CompleteTradeProfile }> {
  const user = await requireUser(nextPath);
  const { profile } = await getMyTradeProfile();

  if (!isCompleteTradeProfile(profile)) {
    const params = new URLSearchParams({
      next: nextPath,
      reason: "complete_profile",
    });
    redirect(`/settings/profile?${params.toString()}`);
  }

  return { user, profile };
}
