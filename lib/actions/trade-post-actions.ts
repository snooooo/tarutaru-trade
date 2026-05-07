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

type LooseTradePostEditSupabase = {
  auth: LoosePostUpdateSupabase["auth"];
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        eq: (
          column: string,
          value: string,
        ) => {
          maybeSingle: () => Promise<{
            data: unknown | null;
            error: { message: string } | null;
          }>;
          order: (
            column: string,
            options?: { ascending?: boolean },
          ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
        };
        order: (
          column: string,
          options?: { ascending?: boolean },
        ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
      };
    };
    update: (values: Record<string, unknown>) => {
      eq: (
        column: string,
        value: string,
      ) => {
        eq: (
          column: string,
          value: string,
        ) => Promise<{ error: { message: string } | null }>;
      };
    };
    insert: (values: Record<string, unknown>) => Promise<{
      error: { message: string } | null;
    }>;
  };
};

function redirectWithError(path: string, message: string): never {
  const params = new URLSearchParams({ error: message });
  redirect(`${path}?${params.toString()}`);
}

function safePath(value: FormDataEntryValue | null, fallback: string) {
  const path = typeof value === "string" ? value : fallback;
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
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

function rawStringValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => (typeof value === "string" ? value : ""));
}

function buildOfferItems(formData: FormData) {
  const ids = rawStringValues(formData, "offer_item_id");
  const names = stringValues(formData, "offer_manual_bottle_name");
  const boxConditions = stringValues(formData, "box_condition");
  const labelConditions = stringValues(formData, "label_condition");
  const imageUrls = stringValues(formData, "image_url");
  const notes = stringValues(formData, "offer_note");

  return names.map((manualBottleName, index) => ({
    id: ids[index] || null,
    manualBottleName,
    boxCondition: boxConditions[index] ?? "with_box_good",
    labelCondition: labelConditions[index] ?? "good",
    imageUrl: imageUrls[index] ?? null,
    note: notes[index] ?? null,
    sortOrder: index,
  }));
}

function buildWantItems(formData: FormData) {
  const ids = rawStringValues(formData, "want_item_id");
  const names = stringValues(formData, "want_manual_bottle_name");
  const conditionNotes = stringValues(formData, "want_condition_note");

  return names.map((manualBottleName, index) => ({
    id: ids[index] || null,
    manualBottleName,
    conditionNote: conditionNotes[index] ?? null,
    sortOrder: index,
  }));
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
  const builtOfferItems = buildOfferItems(formData);
  const builtWantItems = buildWantItems(formData);

  if (!builtOfferItems.some((item) => item.manualBottleName)) {
    redirectWithError(path, "出のボトル名を入力してください。");
  }

  const offerItems = builtOfferItems.flatMap((item) =>
    item.manualBottleName
      ? [
          {
            maltperi_bottle_id: null,
            manual_bottle_name: item.manualBottleName,
            box_condition: item.boxCondition,
            label_condition: item.labelCondition,
            image_url: item.imageUrl,
            note: item.note,
          },
        ]
      : [],
  );
  const wantItems = builtWantItems.flatMap((item) =>
    item.manualBottleName
      ? [
          {
            maltperi_bottle_id: null,
            manual_bottle_name: item.manualBottleName,
            condition_note: item.conditionNote,
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

export async function updateTradePostAction(formData: FormData) {
  const postId = formData.get("trade_post_id");
  const path =
    typeof postId === "string" && postId
      ? `/mypage/posts/${postId}/edit`
      : "/mypage";

  await requireCompleteTradeProfile(path);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(path, "Supabase環境変数が未設定です。");
  }

  if (typeof postId !== "string" || !postId) {
    redirectWithError("/mypage", "トレード投稿が見つかりません。");
  }

  const title = stringValue(formData, "title");
  const conditionNote = stringValue(formData, "condition_note");
  const offerItems = buildOfferItems(formData);
  const wantItems = buildWantItems(formData);
  const activeOfferItems = offerItems.filter((item) => item.manualBottleName);

  if (!activeOfferItems.length) {
    redirectWithError(path, "出のボトル名を1件以上入力してください。");
  }

  const loose = supabase as unknown as LooseTradePostEditSupabase;
  const {
    data: { user },
    error: userError,
  } = await loose.auth.getUser();

  if (userError || !user) {
    redirectWithError(path, userError?.message ?? "ログインが必要です。");
  }

  const postResult = await loose
    .from("trade_posts")
    .select("id,status")
    .eq("id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (postResult.error) {
    redirectWithError(path, postResult.error.message);
  }

  const post = postResult.data as { id: string; status: string } | null;

  if (!post) {
    redirectWithError("/mypage", "トレード投稿が見つかりません。");
  }

  if (post.status !== "public" && post.status !== "private") {
    redirectWithError(path, "相談中または終了済みのトレード投稿は編集できません。");
  }

  const { error: postError } = await loose
    .from("trade_posts")
    .update({ title, condition_note: conditionNote })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (postError) {
    redirectWithError(path, postError.message);
  }

  const [existingOffersResult, existingWantsResult] = await Promise.all([
    loose
      .from("trade_offer_items")
      .select("id")
      .eq("trade_post_id", postId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    loose
      .from("trade_want_items")
      .select("id")
      .eq("trade_post_id", postId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (existingOffersResult.error || existingWantsResult.error) {
    redirectWithError(
      path,
      existingOffersResult.error?.message ??
        existingWantsResult.error?.message ??
        "トレード投稿の明細を読み込めませんでした。",
    );
  }

  const existingOfferIds = new Set(
    (existingOffersResult.data ?? [])
      .map((row) => (row as { id?: unknown }).id)
      .filter((id): id is string => typeof id === "string"),
  );
  const existingWantIds = new Set(
    (existingWantsResult.data ?? [])
      .map((row) => (row as { id?: unknown }).id)
      .filter((id): id is string => typeof id === "string"),
  );
  const usedOfferIds = new Set<string>();
  const usedWantIds = new Set<string>();

  for (const item of offerItems) {
    if (item.id && existingOfferIds.has(item.id)) {
      usedOfferIds.add(item.id);
      const { error } = await loose
        .from("trade_offer_items")
        .update({
          manual_bottle_name: item.manualBottleName,
          maltperi_bottle_id: null,
          box_condition: item.boxCondition,
          label_condition: item.labelCondition,
          image_url: item.imageUrl,
          note: item.note,
          sort_order: item.sortOrder,
          status: item.manualBottleName ? "public" : "private",
        })
        .eq("id", item.id)
        .eq("user_id", user.id);

      if (error) {
        redirectWithError(path, error.message);
      }
    } else if (item.manualBottleName) {
      const { error } = await loose.from("trade_offer_items").insert({
        user_id: user.id,
        trade_post_id: postId,
        maltperi_bottle_id: null,
        manual_bottle_name: item.manualBottleName,
        box_condition: item.boxCondition,
        label_condition: item.labelCondition,
        image_url: item.imageUrl,
        note: item.note,
        sort_order: item.sortOrder,
        status: "public",
      });

      if (error) {
        redirectWithError(path, error.message);
      }
    }
  }

  for (const id of existingOfferIds) {
    if (!usedOfferIds.has(id)) {
      const { error } = await loose
        .from("trade_offer_items")
        .update({ status: "private" })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        redirectWithError(path, error.message);
      }
    }
  }

  for (const item of wantItems) {
    if (item.id && existingWantIds.has(item.id)) {
      usedWantIds.add(item.id);
      const { error } = await loose
        .from("trade_want_items")
        .update({
          manual_bottle_name: item.manualBottleName,
          maltperi_bottle_id: null,
          condition_note: item.conditionNote,
          sort_order: item.sortOrder,
          status: item.manualBottleName ? "public" : "private",
        })
        .eq("id", item.id)
        .eq("user_id", user.id);

      if (error) {
        redirectWithError(path, error.message);
      }
    } else if (item.manualBottleName) {
      const { error } = await loose.from("trade_want_items").insert({
        user_id: user.id,
        trade_post_id: postId,
        maltperi_bottle_id: null,
        manual_bottle_name: item.manualBottleName,
        condition_note: item.conditionNote,
        sort_order: item.sortOrder,
        status: "public",
      });

      if (error) {
        redirectWithError(path, error.message);
      }
    }
  }

  for (const id of existingWantIds) {
    if (!usedWantIds.has(id)) {
      const { error } = await loose
        .from("trade_want_items")
        .update({ status: "private" })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        redirectWithError(path, error.message);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/mypage");
  revalidatePath(path);
  redirect("/mypage?updated=post_updated");
}

export async function updateTradePostVisibilityAction(formData: FormData) {
  const redirectTo = safePath(formData.get("redirect_to"), "/mypage");
  await requireCompleteTradeProfile(redirectTo);
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirectWithError(redirectTo, "Supabase環境変数が未設定です。");
  }

  const postId = formData.get("trade_post_id");
  const nextStatus = formData.get("next_status");

  if (typeof postId !== "string" || !postId) {
    redirectWithError(redirectTo, "トレード投稿が見つかりません。");
  }

  if (nextStatus !== "public" && nextStatus !== "private") {
    redirectWithError(redirectTo, "トレード投稿の状態が不正です。");
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
