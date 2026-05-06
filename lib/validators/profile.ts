import {
  X_FOLLOWERS_RANGES,
  SHIPPING_PREFERENCES,
  type TradeProfile,
  type XFollowersRange,
  type ShippingPreference,
} from "@/lib/types/profile";

export type ProfileFormValues = {
  displayName: string;
  xId: string | null;
  xFollowersRange: XFollowersRange | null;
  shippingPreference: ShippingPreference | null;
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

  const shippingValue = String(formData.get("shipping_preference") ?? "");
  const shippingPreference = SHIPPING_PREFERENCES.includes(
    shippingValue as ShippingPreference,
  )
    ? (shippingValue as ShippingPreference)
    : null;

  return {
    values: {
      displayName,
      xId,
      xFollowersRange,
      shippingPreference,
    },
    errors,
  };
}

export function isCompleteTradeProfile(
  profile: TradeProfile | null,
): profile is TradeProfile & {
  x_id: string;
  x_followers_range: XFollowersRange;
  shipping_preference: ShippingPreference;
  terms_accepted_at: string;
} {
  return Boolean(
    profile &&
      !profile.is_suspended &&
      profile.display_name &&
      profile.x_id &&
      profile.x_followers_range &&
      profile.shipping_preference !== null &&
      profile.terms_accepted_at,
  );
}
