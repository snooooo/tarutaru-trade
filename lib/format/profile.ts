import type { XFollowersRange } from "@/lib/types/profile";

export function formatProfileFollowersRange(range: XFollowersRange | null) {
  const labels: Record<XFollowersRange, string> = {
    under_100: "100人未満",
    "100_499": "100〜499人",
    "500_999": "500〜999人",
    "1000_plus": "1,000人以上",
  };

  return range ? labels[range] : "未設定";
}
