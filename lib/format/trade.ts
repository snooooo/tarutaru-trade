const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const date = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatPrice(value: number | null | undefined) {
  return typeof value === "number" ? yen.format(value) : "相場データなし";
}

export function formatDate(value: string | null | undefined) {
  return value ? date.format(new Date(value)) : "";
}

export function formatBoxCondition(value: string | null | undefined) {
  const labels: Record<string, string> = {
    with_box_good: "箱あり・良好",
    with_box_minor_damage: "箱あり・軽い傷み",
    with_box_damaged: "箱あり・傷みあり",
    no_box: "箱なし",
  };

  return value ? (labels[value] ?? value) : "未設定";
}

export function formatLabelCondition(value: string | null | undefined) {
  const labels: Record<string, string> = {
    good: "良好",
    minor_damage: "軽い傷み",
    damaged: "傷みあり",
  };

  return value ? (labels[value] ?? value) : "未設定";
}

export function formatFollowersRange(value: string | null | undefined) {
  const labels: Record<string, string> = {
    under_100: "Xフォロワー数100未満",
    "100_199": "Xフォロワー数100〜199",
    "200_plus": "Xフォロワー数200以上",
    "100_499": "Xフォロワー数100〜199",
    "500_999": "Xフォロワー数200以上",
    "1000_plus": "Xフォロワー数200以上",
  };

  return value ? (labels[value] ?? value) : "Xフォロワー数 未設定";
}

export function bottleSubline(item: {
  brand_name?: string | null;
  distillery_name_ja?: string | null;
  distillery_area?: string | null;
  country?: string | null;
}) {
  return [
    item.brand_name,
    item.distillery_name_ja,
    item.distillery_area,
    item.country,
  ]
    .filter(Boolean)
    .join(" / ");
}
