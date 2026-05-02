import type { Enums } from "@/lib/supabase/database.types";

export const BOX_CONDITIONS = [
  "with_box_good",
  "with_box_minor_damage",
  "with_box_damaged",
  "no_box",
] as const satisfies readonly Enums<"trade_box_condition">[];

export const LABEL_CONDITIONS = [
  "good",
  "minor_damage",
  "damaged",
] as const satisfies readonly Enums<"trade_label_condition">[];

type BoxCondition = (typeof BOX_CONDITIONS)[number];
type LabelCondition = (typeof LABEL_CONDITIONS)[number];
type EditableItemStatus = "public" | "private";

export type OfferFormValues = {
  maltperiBottleId: string | null;
  manualBottleName: string | null;
  boxCondition: BoxCondition;
  labelCondition: LabelCondition;
  imageUrl: string | null;
  note: string | null;
};

export type OfferUpdateFormValues = {
  boxCondition: BoxCondition;
  labelCondition: LabelCondition;
  imageUrl: string | null;
  note: string | null;
  status: EditableItemStatus;
};

export type WantFormValues = {
  maltperiBottleId: string | null;
  manualBottleName: string | null;
  conditionNote: string | null;
};

export type WantUpdateFormValues = {
  conditionNote: string | null;
  status: EditableItemStatus;
};

function trimmed(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function selectedBottleId(value: FormDataEntryValue | null) {
  const text = trimmed(value);
  return text && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)
    ? text
    : null;
}

function optionalUrl(value: FormDataEntryValue | null, errors: string[]) {
  const text = trimmed(value);

  if (!text) {
    return null;
  }

  try {
    const url = new URL(text);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      errors.push("画像URLは http または https のURLを入力してください。");
      return null;
    }
  } catch {
    errors.push("画像URLの形式を確認してください。");
    return null;
  }

  return text;
}

function bottleFields(formData: FormData, errors: string[]) {
  const maltperiBottleId = selectedBottleId(formData.get("maltperi_bottle_id"));
  const manualBottleName = maltperiBottleId
    ? null
    : trimmed(formData.get("manual_bottle_name"));

  if (!maltperiBottleId && !manualBottleName) {
    errors.push("MaltPeriボトルを選ぶか、手動ボトル名を入力してください。");
  }

  if (manualBottleName && manualBottleName.length > 120) {
    errors.push("手動ボトル名は120文字以内で入力してください。");
  }

  return { maltperiBottleId, manualBottleName };
}

export function parseOfferForm(formData: FormData): {
  values: OfferFormValues;
  errors: string[];
} {
  const errors: string[] = [];
  const { maltperiBottleId, manualBottleName } = bottleFields(formData, errors);
  const boxConditionValue = String(formData.get("box_condition") ?? "");
  const labelConditionValue = String(formData.get("label_condition") ?? "");
  const boxCondition = BOX_CONDITIONS.includes(boxConditionValue as BoxCondition)
    ? (boxConditionValue as BoxCondition)
    : null;
  const labelCondition = LABEL_CONDITIONS.includes(
    labelConditionValue as LabelCondition,
  )
    ? (labelConditionValue as LabelCondition)
    : null;
  const note = trimmed(formData.get("note"));

  if (!boxCondition) {
    errors.push("箱状態を選択してください。");
  }

  if (!labelCondition) {
    errors.push("ラベル状態を選択してください。");
  }

  if (note && note.length > 1000) {
    errors.push("備考は1000文字以内で入力してください。");
  }

  return {
    values: {
      maltperiBottleId,
      manualBottleName,
      boxCondition: boxCondition ?? "with_box_good",
      labelCondition: labelCondition ?? "good",
      imageUrl: optionalUrl(formData.get("image_url"), errors),
      note,
    },
    errors,
  };
}

function editableStatus(formData: FormData, errors: string[]) {
  const status = String(formData.get("status") ?? "");

  if (status === "public" || status === "private") {
    return status;
  }

  errors.push("公開状態を選択してください。");
  return "private";
}

export function parseOfferUpdateForm(formData: FormData): {
  values: OfferUpdateFormValues;
  errors: string[];
} {
  const errors: string[] = [];
  const boxConditionValue = String(formData.get("box_condition") ?? "");
  const labelConditionValue = String(formData.get("label_condition") ?? "");
  const boxCondition = BOX_CONDITIONS.includes(boxConditionValue as BoxCondition)
    ? (boxConditionValue as BoxCondition)
    : null;
  const labelCondition = LABEL_CONDITIONS.includes(
    labelConditionValue as LabelCondition,
  )
    ? (labelConditionValue as LabelCondition)
    : null;
  const note = trimmed(formData.get("note"));

  if (!boxCondition) {
    errors.push("箱状態を選択してください。");
  }

  if (!labelCondition) {
    errors.push("ラベル状態を選択してください。");
  }

  if (note && note.length > 1000) {
    errors.push("備考は1000文字以内で入力してください。");
  }

  return {
    values: {
      boxCondition: boxCondition ?? "with_box_good",
      labelCondition: labelCondition ?? "good",
      imageUrl: optionalUrl(formData.get("image_url"), errors),
      note,
      status: editableStatus(formData, errors),
    },
    errors,
  };
}

export function parseWantForm(formData: FormData): {
  values: WantFormValues;
  errors: string[];
} {
  const errors: string[] = [];
  const { maltperiBottleId, manualBottleName } = bottleFields(formData, errors);
  const conditionNote = trimmed(formData.get("condition_note"));

  if (conditionNote && conditionNote.length > 1000) {
    errors.push("希望条件メモは1000文字以内で入力してください。");
  }

  return {
    values: {
      maltperiBottleId,
      manualBottleName,
      conditionNote,
    },
    errors,
  };
}

export function parseWantUpdateForm(formData: FormData): {
  values: WantUpdateFormValues;
  errors: string[];
} {
  const errors: string[] = [];
  const conditionNote = trimmed(formData.get("condition_note"));

  if (conditionNote && conditionNote.length > 1000) {
    errors.push("希望条件メモは1000文字以内で入力してください。");
  }

  return {
    values: {
      conditionNote,
      status: editableStatus(formData, errors),
    },
    errors,
  };
}
