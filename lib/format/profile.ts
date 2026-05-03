import type { XFollowersRange } from "@/lib/types/profile";

export function formatProfileFollowersRange(range: XFollowersRange | null) {
  const labels: Record<XFollowersRange, string> = {
    under_100: "100人未満",
    "100_199": "100〜199人",
    "200_plus": "200人以上",
  };

  return range ? labels[range] : "未設定";
}
