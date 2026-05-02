import {
  X_FOLLOWERS_RANGES,
  type TradeProfile,
  type XFollowersRange,
} from "@/lib/types/profile";

export type ProfileFormValues = {
  displayName: string;
  xId: string | null;
  xFollowersRange: XFollowersRange | null;
  anonymousShippingOk: boolean;
  termsAccepted: boolean;
};

export function normalizeXId(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return null;
  }

  return raw
    .replace(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0]
    .trim();
}

export function parseProfileForm(formData: FormData): {
  values: ProfileFormValues;
  errors: string[];
} {
  const errors: string[] = [];
  const displayName = String(formData.get("display_name") ?? "").trim();
  const xId = normalizeXId(formData.get("x_id"));
  const followersValue = String(formData.get("x_followers_range") ?? "");
  const xFollowersRange = X_FOLLOWERS_RANGES.includes(
    followersValue as XFollowersRange,
  )
    ? (followersValue as XFollowersRange)
    : null;

  if (!displayName || displayName.length > 40) {
    errors.push("表示名は1〜40文字で入力してください。");
  }

  if (xId && !/^[A-Za-z0-9_]{1,15}$/.test(xId)) {
    errors.push("X IDは英数字とアンダースコアのみ、15文字以内で入力してください。");
  }

  return {
    values: {
      displayName,
      xId,
      xFollowersRange,
      anonymousShippingOk: formData.get("anonymous_shipping_ok") === "on",
      termsAccepted: formData.get("terms_accepted") === "on",
    },
    errors,
  };
}

export function isCompleteTradeProfile(
  profile: TradeProfile | null,
): profile is TradeProfile & {
  x_id: string;
  x_followers_range: XFollowersRange;
  anonymous_shipping_ok: boolean;
  terms_accepted_at: string;
} {
  return Boolean(
    profile &&
      !profile.is_suspended &&
      profile.display_name &&
      profile.x_id &&
      profile.x_followers_range &&
      profile.anonymous_shipping_ok !== null &&
      profile.terms_accepted_at,
  );
}
