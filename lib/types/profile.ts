export const PREFECTURES = [
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県",
  "沖縄県",
] as const;

export type Prefecture = (typeof PREFECTURES)[number];

export const X_FOLLOWERS_RANGES = [
  "under_100",
  "100_499",
  "500_999",
] as const;

export type XFollowersRange = (typeof X_FOLLOWERS_RANGES)[number];

export const SHIPPING_PREFERENCES = [
  "anonymous_only",
  "negotiable",
  "disclose_preferred",
] as const;

export type ShippingPreference = (typeof SHIPPING_PREFERENCES)[number];

export type TradeProfile = {
  user_id: string;
  display_name: string;
  x_id: string | null;
  x_followers_range: XFollowersRange | null;
  shipping_preference: ShippingPreference | null;
  shipping_region: string | null;
  is_suspended: boolean;
  terms_accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CompleteTradeProfile = TradeProfile & {
  x_id: string;
  x_followers_range: XFollowersRange;
  shipping_preference: ShippingPreference;
  terms_accepted_at: string;
};
