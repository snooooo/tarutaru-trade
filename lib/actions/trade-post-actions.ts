"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LooseRpcSupabase = {
  rpc: (
    fn: "trade_create_post",
    args: {
      p_title: string | null;
      p_condition_note: string | null;
      p_offer_items: unknown[];
      p_want_items: unknown[];
    },
  ) => Promise<{ error: { message: string } | null }>;
};

type LoosePostUpdateSupabase = {
  from: (table: "trade_posts") => {
    update: (values: { status: "public" | "private" }) => {
      eq: (
        column: "id",
        value: string,
      ) => {
        eq: (
          column: "user_id",
          value: string,
        ) => Promise<{ error: { message: string } | null }>;
      };
    };
  };
  auth: {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error: { message: string } | null;
    }>;
  };
};

function redirectWithError(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stringValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .map((value) => (value ? value : null));
}

export async function createTradePostAction(formData: FormData) {
  const path = "/mypage/posts/new";
  await requireCompleteTradeProfile(path);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(path, "Supabase環境変数が未設定です。");
  }

  const title = stringValue(formData, "title");
  const conditionNote = stringValue(formData, "condition_note");
  const offerManualBottleNames = stringValues(
    formData,
    "offer_manual_bottle_name",
  );
  const offerBoxConditions = stringValues(formData, "box_condition");
  const offerLabelConditions = stringValues(formData, "label_condition");
  const offerImageUrls = stringValues(formData, "image_url");
  const offerNotes = stringValues(formData, "offer_note");
  const wantManualBottleNames = stringValues(
    formData,
    "want_manual_bottle_name",
  );
  const wantConditionNotes = stringValues(formData, "want_condition_note");

  if (!offerManualBottleNames.some(Boolean)) {
    redirectWithError(path, "出るボトル名を入力してください。");
  }

  const offerItems = offerManualBottleNames.flatMap((manualBottleName, index) =>
    manualBottleName
      ? [
          {
            maltperi_bottle_id: null,
            manual_bottle_name: manualBottleName,
            box_condition: offerBoxConditions[index] ?? "with_box_good",
            label_condition: offerLabelConditions[index] ?? "good",
            image_url: offerImageUrls[index] ?? null,
            note: offerNotes[index] ?? null,
          },
        ]
      : [],
  );
  const wantItems = wantManualBottleNames.flatMap((manualBottleName, index) =>
    manualBottleName
      ? [
          {
            maltperi_bottle_id: null,
            manual_bottle_name: manualBottleName,
            condition_note: wantConditionNotes[index] ?? null,
          },
        ]
      : [],
  );

  const { error } = await (supabase as unknown as LooseRpcSupabase).rpc(
    "trade_create_post",
    {
      p_title: title,
      p_condition_note: conditionNote,
      p_offer_items: offerItems,
      p_want_items: wantItems,
    },
  );

  if (error) {
    redirectWithError(path, error.message);
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/mypage");
  redirect("/posts?created=post");
}

export async function updateTradePostVisibilityAction(formData: FormData) {
  const redirectTo = "/mypage";
  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  const postId = formData.get("trade_post_id");
  const nextStatus = formData.get("next_status");

  if (typeof postId !== "string" || !postId) {
    redirectWithError(redirectTo, "交換投稿が見つかりません。");
  }

  if (nextStatus !== "public" && nextStatus !== "private") {
    redirectWithError(redirectTo, "交換投稿の状態が不正です。");
  }

  const loose = supabase as unknown as LoosePostUpdateSupabase;
  const {
    data: { user },
    error: userError,
  } = await loose.auth.getUser();

  if (userError || !user) {
    redirectWithError(redirectTo, userError?.message ?? "ログインが必要です。");
  }

  const { error } = await loose
    .from("trade_posts")
    .update({ status: nextStatus })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/mypage");
  redirect(
    `${redirectTo}?updated=${nextStatus === "private" ? "post_private" : "post_public"}`,
  );
}
