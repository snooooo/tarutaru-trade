import Link from "next/link";
import { ArrowRight, Star, Truck } from "lucide-react";
import {
  bottleSubline,
  formatBoxCondition,
  formatDate,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";
import type { PublicOfferItem } from "@/lib/types/trade";

export function OfferCard({ offer }: { offer: PublicOfferItem }) {
  const subline = bottleSubline(offer);

  return (
    <Link
      href={`/offers/${offer.id}`}
      className="group grid gap-4 rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
              出せるもの
            </span>
          </div>
          <p className="text-xs font-medium text-stone-500">
            {formatDate(offer.created_at)}
          </p>
        </div>
        <div>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-stone-950">
            {offer.display_bottle_name ?? "名称未設定のボトル"}
          </h3>
          {subline ? (
            <p className="mt-1 line-clamp-1 text-sm text-stone-600">{subline}</p>
          ) : null}
        </div>
        <div className="grid gap-2 text-sm text-stone-700">
          <div className="flex items-center justify-between gap-3">
            <span>ヤフオク中央値</span>
            <strong className="text-stone-950">
              {formatPrice(offer.median_price)}
            </strong>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-stone-100 px-2 py-1">
              {formatBoxCondition(offer.box_condition)}
            </span>
            <span className="rounded bg-stone-100 px-2 py-1">
              ラベル {formatLabelCondition(offer.label_condition)}
            </span>
          </div>
        </div>
        <div className="min-h-16 rounded bg-stone-50 p-3 text-sm leading-6 text-stone-700">
          <p className="line-clamp-3">{offer.note || "備考の記載なし"}</p>
        </div>
        <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm text-stone-600">
          <span>{offer.owner_display_name ?? "ななしさん"}</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star size={14} aria-hidden="true" />
              {offer.owner_average_rating?.toFixed(1) ?? "-"}
            </span>
            {offer.owner_anonymous_shipping_ok ? (
              <Truck size={15} aria-label="匿名配送OK" />
            ) : null}
          </span>
        </div>
        <div className="flex items-center justify-end gap-1 text-sm font-medium text-stone-950">
          条件を見て相談へ
          <ArrowRight size={15} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
