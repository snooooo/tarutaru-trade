import { createPublicSupabaseClient } from "@/lib/supabase/server";
import type { PublicOfferItem, PublicWantItem } from "@/lib/types/trade";

const PAGE_SIZE = 24;

type QueryResult<T> = {
  data: T[];
  error: string | null;
  isConfigured: boolean;
};

function ilikePattern(query?: string) {
  const trimmed = query?.trim();
  return trimmed ? `%${trimmed}%` : null;
}

export async function getPublicOffers(options?: {
  limit?: number;
  query?: string;
}): Promise<QueryResult<PublicOfferItem>> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const pattern = ilikePattern(options?.query);
  let request = supabase
    .from("trade_public_offer_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? PAGE_SIZE);

  if (pattern) {
    request = request.or(
      [
        `display_bottle_name.ilike.${pattern}`,
        `brand_name.ilike.${pattern}`,
        `distillery_name_ja.ilike.${pattern}`,
        `distillery_area.ilike.${pattern}`,
        `country.ilike.${pattern}`,
      ].join(","),
    );
  }

  const { data, error } = await request;

  return {
    data: (data ?? []) as PublicOfferItem[],
    error: error?.message ?? null,
    isConfigured: true,
  };
}

export async function getPublicOffer(
  offerId: string,
): Promise<QueryResult<PublicOfferItem>> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const { data, error } = await supabase
    .from("trade_public_offer_items")
    .select("*")
    .eq("id", offerId)
    .maybeSingle();

  return {
    data: data ? ([data] as PublicOfferItem[]) : [],
    error: error?.message ?? null,
    isConfigured: true,
  };
}

export async function getPublicWants(options?: {
  limit?: number;
  query?: string;
}): Promise<QueryResult<PublicWantItem>> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const pattern = ilikePattern(options?.query);
  let request = supabase
    .from("trade_public_want_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? PAGE_SIZE);

  if (pattern) {
    request = request.or(
      [
        `display_bottle_name.ilike.${pattern}`,
        `brand_name.ilike.${pattern}`,
        `distillery_name_ja.ilike.${pattern}`,
        `distillery_area.ilike.${pattern}`,
        `country.ilike.${pattern}`,
      ].join(","),
    );
  }

  const { data, error } = await request;

  return {
    data: (data ?? []) as PublicWantItem[],
    error: error?.message ?? null,
    isConfigured: true,
  };
}

export async function getPublicWant(
  wantId: string,
): Promise<QueryResult<PublicWantItem>> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const { data, error } = await supabase
    .from("trade_public_want_items")
    .select("*")
    .eq("id", wantId)
    .maybeSingle();

  return {
    data: data ? ([data] as PublicWantItem[]) : [],
    error: error?.message ?? null,
    isConfigured: true,
  };
}
