import type { ShippingPreference, XFollowersRange } from "@/lib/types/profile";

export function formatProfileFollowersRange(range: XFollowersRange | null) {
  const labels: Record<XFollowersRange, string> = {
    under_100: "100人未満",
    "100_499": "100〜199人",
    "500_999": "200人以上",
  };

  return range ? labels[range] : "未設定";
}

export function formatShippingPreference(pref: ShippingPreference | null) {
  if (!pref) return "未設定";
  const labels: Record<ShippingPreference, string> = {
    anonymous_only: "匿名のみ",
    negotiable: "相談して決めたい",
    disclose_preferred: "氏名開示希望",
  };
  return labels[pref];
}
