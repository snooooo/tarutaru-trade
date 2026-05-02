import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

export type ManagedOfferItem = {
  id: string;
  display_bottle_name: string | null;
  brand_name: string | null;
  country: string | null;
  distillery_name_ja: string | null;
  box_condition: Enums<"trade_box_condition">;
  label_condition: Enums<"trade_label_condition">;
  image_url: string | null;
  note: string | null;
  status: Enums<"trade_item_status">;
  created_at: string;
};

export type ManagedWantItem = {
  id: string;
  display_bottle_name: string | null;
  brand_name: string | null;
  country: string | null;
  distillery_name_ja: string | null;
  condition_note: string | null;
  status: Enums<"trade_item_status">;
  created_at: string;
};

type QueryResult<T> = {
  data: T | null;
  error: string | null;
  isConfigured: boolean;
};

type BottleRow = {
  id: string;
  bottle_name: string;
  brand_name: string | null;
  country: string | null;
  distillery_name_ja: string | null;
};

async function getBottle(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  bottleId: string | null,
) {
  if (!bottleId) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase
    .from("bottles")
    .select("id,bottle_name,brand_name,country,distillery_name_ja")
    .eq("id", bottleId)
    .maybeSingle();

  return { data: (data as BottleRow | null) ?? null, error };
}

export async function getMyOfferItem(
  offerId: string,
): Promise<QueryResult<ManagedOfferItem>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: null, error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_offer_items")
    .select(
      "id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,created_at",
    )
    .eq("id", offerId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return {
      data: null,
      error: error?.message ?? "出品が見つかりません。",
      isConfigured: true,
    };
  }

  const bottle = await getBottle(supabase, data.maltperi_bottle_id);

  return {
    data: {
      id: data.id,
      display_bottle_name:
        data.manual_bottle_name ?? bottle.data?.bottle_name ?? null,
      brand_name: bottle.data?.brand_name ?? null,
      country: bottle.data?.country ?? null,
      distillery_name_ja: bottle.data?.distillery_name_ja ?? null,
      box_condition: data.box_condition,
      label_condition: data.label_condition,
      image_url: data.image_url,
      note: data.note,
      status: data.status,
      created_at: data.created_at,
    },
    error: bottle.error?.message ?? null,
    isConfigured: true,
  };
}

export async function getMyWantItem(
  wantId: string,
): Promise<QueryResult<ManagedWantItem>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: null, error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_want_items")
    .select("id,maltperi_bottle_id,manual_bottle_name,condition_note,status,created_at")
    .eq("id", wantId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return {
      data: null,
      error: error?.message ?? "募集が見つかりません。",
      isConfigured: true,
    };
  }

  const bottle = await getBottle(supabase, data.maltperi_bottle_id);

  return {
    data: {
      id: data.id,
      display_bottle_name:
        data.manual_bottle_name ?? bottle.data?.bottle_name ?? null,
      brand_name: bottle.data?.brand_name ?? null,
      country: bottle.data?.country ?? null,
      distillery_name_ja: bottle.data?.distillery_name_ja ?? null,
      condition_note: data.condition_note,
      status: data.status,
      created_at: data.created_at,
    },
    error: bottle.error?.message ?? null,
    isConfigured: true,
  };
}
