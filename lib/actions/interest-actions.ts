"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { InterestTargetType } from "@/lib/types/interests";

type LooseRpcSupabase = {
  rpc: (
    fn: "trade_create_post_interest",
    args: {
      p_target_trade_post_id: string;
      p_proposal_offer_items: unknown[];
    },
  ) => Promise<{ error: { message: string } | null }>;
};

function safePath(value: FormDataEntryValue | null, fallback: string) {
  const path = typeof value === "string" ? value : fallback;
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

function redirectWithError(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

function stringValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .map((value) => (value ? value : null));
}

export async function createInterestAction(formData: FormData) {
  const returnPath = safePath(formData.get("return_path"), "/posts");
  await requireCompleteTradeProfile(returnPath);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(returnPath, "Supabase環境変数が未設定です。");
  }

  const targetType = formData.get("target_type");
  const targetId = formData.get("target_id");
  const proposedOfferItemId = formData.get("proposed_offer_item_id");

  if (targetType !== "offer" && targetType !== "want") {
    redirectWithError(returnPath, "興味あり対象が不正です。");
  }

  if (typeof targetId !== "string" || !targetId) {
    redirectWithError(returnPath, "対象が見つかりません。");
  }

  if (typeof proposedOfferItemId !== "string" || !proposedOfferItemId) {
    redirectWithError(returnPath, "トレード候補ボトルを選んでください。");
  }

  const { error } = await supabase.rpc("trade_create_interest", {
    p_target_type: targetType as InterestTargetType,
    p_target_id: targetId,
    p_proposed_offer_item_id: proposedOfferItemId,
  });

  if (error) {
    redirectWithError(returnPath, error.message);
  }

  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  redirect("/mypage/interests/sent?created=interest");
}

export async function createPostInterestAction(formData: FormData) {
  const returnPath = safePath(formData.get("return_path"), "/posts");
  await requireCompleteTradeProfile(returnPath);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(returnPath, "Supabase環境変数が未設定です。");
  }

  const targetPostId = formData.get("target_trade_post_id");
  const manualBottleNames = stringValues(formData, "proposal_manual_bottle_name");
  const boxConditions = stringValues(formData, "proposal_box_condition");
  const labelConditions = stringValues(formData, "proposal_label_condition");
  const imageUrls = stringValues(formData, "proposal_image_url");
  const notes = stringValues(formData, "proposal_note");

  if (typeof targetPostId !== "string" || !targetPostId) {
    redirectWithError(returnPath, "トレード投稿が見つかりません。");
  }

  if (!manualBottleNames.some(Boolean)) {
    redirectWithError(returnPath, "トレード候補ボトル名を入力してください。");
  }

  const proposalOfferItems = manualBottleNames.flatMap((manualBottleName, index) =>
    manualBottleName
      ? [
          {
            maltperi_bottle_id: null,
            manual_bottle_name: manualBottleName,
            box_condition: boxConditions[index] ?? "with_box_good",
            label_condition: labelConditions[index] ?? "good",
            image_url: imageUrls[index] ?? null,
            note: notes[index] ?? null,
          },
        ]
      : [],
  );

  const { error } = await (supabase as unknown as LooseRpcSupabase).rpc(
    "trade_create_post_interest",
    {
      p_target_trade_post_id: targetPostId,
      p_proposal_offer_items: proposalOfferItems,
    },
  );

  if (error) {
    redirectWithError(returnPath, error.message);
  }

  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  redirect("/mypage/interests/sent?created=interest");
}

export async function startConsultingInterestAction(formData: FormData) {
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage/interests/received");
  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();
  const interestId = formData.get("interest_id");

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof interestId !== "string" || !interestId) {
    redirectWithError(redirectTo, "興味ありIDが不正です。");
  }

  const { error } = await supabase.rpc("trade_start_consulting", {
    p_interest_id: interestId,
  });

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  redirect(`${redirectTo}?updated=consulting`);
}

export async function dismissInterestAction(formData: FormData) {
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage/interests/received");
  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();
  const interestId = formData.get("interest_id");

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof interestId !== "string" || !interestId) {
    redirectWithError(redirectTo, "興味ありIDが不正です。");
  }

  const { error } = await supabase.rpc("trade_dismiss_interest", {
    p_interest_id: interestId,
  });

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  redirect(`${redirectTo}?updated=dismissed`);
}

export async function cancelInterestAction(formData: FormData) {
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage/interests/sent");
  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();
  const interestId = formData.get("interest_id");

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof interestId !== "string" || !interestId) {
    redirectWithError(redirectTo, "興味ありIDが不正です。");
  }

  const { error } = await supabase.rpc("trade_cancel_interest", {
    p_interest_id: interestId,
  });

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  redirect(`${redirectTo}?updated=canceled`);
}

export async function markTradeCompletedAction(formData: FormData) {
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage/interests/sent");
  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();
  const interestId = formData.get("interest_id");

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof interestId !== "string" || !interestId) {
    redirectWithError(redirectTo, "興味ありIDが不正です。");
  }

  const { data, error } = await supabase.rpc("trade_mark_completed", {
    p_interest_id: interestId,
  });

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  revalidatePath(`/trades/${interestId}`);
  redirect(`${redirectTo}?updated=${data ?? "completion_requested"}`);
}

export async function createTradeReviewAction(formData: FormData) {
  const interestId = formData.get("interest_id");
  const redirectTo =
    typeof interestId === "string" && interestId
      ? `/trades/${interestId}/review`
      : "/mypage/interests/sent";

  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();
  const ratingValue = formData.get("rating");
  const commentValue = formData.get("comment");

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  if (typeof interestId !== "string" || !interestId) {
    redirectWithError(redirectTo, "興味ありIDが不正です。");
  }

  const rating =
    typeof ratingValue === "string" ? Number.parseInt(ratingValue, 10) : NaN;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirectWithError(redirectTo, "評価は1から5で選んでください。");
  }

  const comment =
    typeof commentValue === "string" && commentValue.trim()
      ? commentValue.trim()
      : null;

  const { error } = await supabase.rpc("trade_create_review", {
    p_interest_id: interestId,
    p_rating: rating,
    p_comment: comment ?? undefined,
  });

  if (error) {
    redirectWithError(redirectTo, error.message);
  }

  revalidatePath(`/trades/${interestId}`);
  revalidatePath(`/trades/${interestId}/review`);
  revalidatePath("/mypage/interests/sent");
  revalidatePath("/mypage/interests/received");
  redirect(`/trades/${interestId}?updated=reviewed`);
}
