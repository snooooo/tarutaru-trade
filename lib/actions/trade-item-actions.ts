"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  parseOfferForm,
  parseOfferUpdateForm,
  parseWantForm,
  parseWantUpdateForm,
} from "@/lib/validators/trade-items";

function safePath(value: FormDataEntryValue | null, fallback: string) {
  const path = typeof value === "string" ? value : fallback;
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

function redirectWithError(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

export async function createOfferItemAction(formData: FormData) {
  const path = "/mypage/offers/new";
  const { user } = await requireCompleteTradeProfile(path);
  const supabase = await createServerSupabaseClient();
  const { values, errors } = parseOfferForm(formData);

  if (!supabase) {
    redirectWithError(path, "Supabase環境変数が未設定です。");
  }

  if (errors.length) {
    redirectWithError(path, errors[0]);
  }

  const { error } = await supabase.from("trade_offer_items").insert({
    user_id: user.id,
    maltperi_bottle_id: values.maltperiBottleId,
    manual_bottle_name: values.manualBottleName,
    box_condition: values.boxCondition,
    label_condition: values.labelCondition,
    image_url: values.imageUrl,
    note: values.note,
    status: "public",
  });

  if (error) {
    redirectWithError(path, error.message);
  }

  revalidatePath("/offers");
  redirect("/offers?created=offer");
}

export async function createWantItemAction(formData: FormData) {
  const path = "/mypage/wants/new";
  const { user } = await requireCompleteTradeProfile(path);
  const supabase = await createServerSupabaseClient();
  const { values, errors } = parseWantForm(formData);

  if (!supabase) {
    redirectWithError(path, "Supabase環境変数が未設定です。");
  }

  if (errors.length) {
    redirectWithError(path, errors[0]);
  }

  const { error } = await supabase.from("trade_want_items").insert({
    user_id: user.id,
    maltperi_bottle_id: values.maltperiBottleId,
    manual_bottle_name: values.manualBottleName,
    condition_note: values.conditionNote,
    status: "public",
  });

  if (error) {
    redirectWithError(path, error.message);
  }

  revalidatePath("/wants");
  redirect("/wants?created=want");
}

export async function updateOfferItemAction(formData: FormData) {
  const offerId = formData.get("offer_id");
  const path =
    typeof offerId === "string" && offerId
      ? `/mypage/offers/${offerId}/edit`
      : "/mypage";
  const { user } = await requireCompleteTradeProfile(path);
  const supabase = await createServerSupabaseClient();
  const { values, errors } = parseOfferUpdateForm(formData);

  if (!supabase) {
    redirectWithError(path, "Supabase環境変数が未設定です。");
  }

  if (typeof offerId !== "string" || !offerId) {
    redirectWithError(path, "出品が見つかりません。");
  }

  if (errors.length) {
    redirectWithError(path, errors[0]);
  }

  const { data, error } = await supabase
    .from("trade_offer_items")
    .update({
      box_condition: values.boxCondition,
      label_condition: values.labelCondition,
      image_url: values.imageUrl,
      note: values.note,
      status: values.status,
    })
    .eq("id", offerId)
    .eq("user_id", user.id)
    .in("status", ["public", "private"])
    .select("id");

  if (error) {
    redirectWithError(path, error.message);
  }

  if (!data?.length) {
    redirectWithError(path, "進行中または終了済みの出品は編集できません。");
  }

  revalidatePath("/mypage");
  revalidatePath("/offers");
  revalidatePath(`/offers/${offerId}`);
  redirect(`${path}?updated=offer`);
}

export async function withdrawOfferItemAction(formData: FormData) {
  const offerId = formData.get("offer_id");
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage");
  const { user } = await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof offerId !== "string" || !offerId) {
    redirectWithError(redirectTo, "出品が見つかりません。");
  }

  const { data, error } = await supabase
    .from("trade_offer_items")
    .update({ status: "private" })
    .eq("id", offerId)
    .eq("user_id", user.id)
    .in("status", ["public", "private"])
    .select("id");

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  if (!data?.length) {
    redirectWithError(redirectTo, "進行中または終了済みの出品は取り下げできません。");
  }

  revalidatePath("/mypage");
  revalidatePath("/offers");
  revalidatePath(`/offers/${offerId}`);
  redirect(`${redirectTo}?updated=offer_withdrawn`);
}

export async function updateWantItemAction(formData: FormData) {
  const wantId = formData.get("want_id");
  const path =
    typeof wantId === "string" && wantId
      ? `/mypage/wants/${wantId}/edit`
      : "/mypage";
  const { user } = await requireCompleteTradeProfile(path);
  const supabase = await createServerSupabaseClient();
  const { values, errors } = parseWantUpdateForm(formData);

  if (!supabase) {
    redirectWithError(path, "Supabase環境変数が未設定です。");
  }

  if (typeof wantId !== "string" || !wantId) {
    redirectWithError(path, "募集が見つかりません。");
  }

  if (errors.length) {
    redirectWithError(path, errors[0]);
  }

  const { data, error } = await supabase
    .from("trade_want_items")
    .update({
      condition_note: values.conditionNote,
      status: values.status,
    })
    .eq("id", wantId)
    .eq("user_id", user.id)
    .in("status", ["public", "private"])
    .select("id");

  if (error) {
    redirectWithError(path, error.message);
  }

  if (!data?.length) {
    redirectWithError(path, "進行中または終了済みの募集は編集できません。");
  }

  revalidatePath("/mypage");
  revalidatePath("/wants");
  revalidatePath(`/wants/${wantId}`);
  redirect(`${path}?updated=want`);
}

export async function withdrawWantItemAction(formData: FormData) {
  const wantId = formData.get("want_id");
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage");
  const { user } = await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof wantId !== "string" || !wantId) {
    redirectWithError(redirectTo, "募集が見つかりません。");
  }

  const { data, error } = await supabase
    .from("trade_want_items")
    .update({ status: "private" })
    .eq("id", wantId)
    .eq("user_id", user.id)
    .in("status", ["public", "private"])
    .select("id");

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  if (!data?.length) {
    redirectWithError(redirectTo, "進行中または終了済みの募集は取り下げできません。");
  }

  revalidatePath("/mypage");
  revalidatePath("/wants");
  revalidatePath(`/wants/${wantId}`);
  redirect(`${redirectTo}?updated=want_withdrawn`);
}
