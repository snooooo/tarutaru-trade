import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TradeProfile } from "@/lib/types/profile";

export async function getMyTradeProfile() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { profile: null, error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      profile: null,
      error: userError?.message ?? null,
      isConfigured: true,
    };
  }

  const { data, error } = await supabase
    .from("trade_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    profile: (data as TradeProfile | null) ?? null,
    error: error?.message ?? null,
    isConfigured: true,
  };
}
