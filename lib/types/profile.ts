export const X_FOLLOWERS_RANGES = [
  "under_100",
  "100_499",
  "500_999",
] as const;

export type XFollowersRange = (typeof X_FOLLOWERS_RANGES)[number];

export type TradeProfile = {
  user_id: string;
  display_name: string;
  x_id: string | null;
  x_followers_range: XFollowersRange | null;
  anonymous_shipping_ok: boolean | null;
  is_suspended: boolean;
  terms_accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CompleteTradeProfile = TradeProfile & {
  x_id: string;
  x_followers_range: XFollowersRange;
  anonymous_shipping_ok: boolean;
  terms_accepted_at: string;
};
