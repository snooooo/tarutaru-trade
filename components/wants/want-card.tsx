import Link from "next/link";
import { ArrowRight, Star, Truck } from "lucide-react";
import { bottleSubline, formatDate, formatPrice } from "@/lib/format/trade";
import type { PublicWantItem } from "@/lib/types/trade";

export function WantCard({ want }: { want: PublicWantItem }) {
  const subline = bottleSubline(want);

  return (
    <Link
      href={`/wants/${want.id}`}
      className="group grid gap-4 rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
            欲しいもの
          </span>
        </div>
        <p className="text-xs font-medium text-stone-500">
          {formatDate(want.created_at)}
        </p>
      </div>
      <div>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-stone-950">
          {want.display_bottle_name ?? "名称未設定のボトル"}
        </h3>
        {subline ? (
          <p className="mt-1 line-clamp-1 text-sm text-stone-600">{subline}</p>
        ) : null}
      </div>
      <div className="min-h-16 rounded bg-stone-50 p-3 text-sm leading-6 text-stone-700">
        <p className="line-clamp-3">
          {want.condition_note || "希望条件の記載なし"}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-stone-600">ヤフオク中央値</span>
        <strong>{formatPrice(want.median_price)}</strong>
      </div>
      <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm text-stone-600">
        <span>{want.owner_display_name ?? "ななしさん"}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star size={14} aria-hidden="true" />
            {want.owner_average_rating?.toFixed(1) ?? "-"}
          </span>
          {want.owner_anonymous_shipping_ok ? (
            <Truck size={15} aria-label="匿名配送OK" />
          ) : null}
        </span>
      </div>
      <div className="flex items-center justify-end gap-1 text-sm font-medium text-stone-950">
        条件を見て相談へ
        <ArrowRight size={15} aria-hidden="true" />
      </div>
    </Link>
  );
}
