import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Truck } from "lucide-react";
import {
  bottleSubline,
  formatBoxCondition,
  formatDate,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";
import type {
  PublicTradePost,
  PublicTradePostOfferItem,
  PublicTradePostWantItem,
} from "@/lib/types/trade-posts";

export function TradePostCard({ post }: { post: PublicTradePost }) {
  const primaryWant = post.want_items[0];

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group grid gap-3 rounded-md border border-stone-200 bg-white/88 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white hover:shadow-md sm:p-4"
    >
      <div className="flex items-start justify-end gap-2">
        <p className="text-xs font-medium text-stone-500">
          {formatDate(post.published_at ?? post.created_at)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <OfferPanel items={post.offer_items} />
        <WantPanel items={post.want_items} primaryWant={primaryWant} />
      </div>

      {post.condition_note ? (
        <p className="line-clamp-2 text-sm leading-6 text-stone-700">
          {post.condition_note}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-sm text-stone-600">
        <span className="min-w-0 truncate">{post.owner_display_name ?? "ななしさん"}</span>
        <span className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <Star size={14} aria-hidden="true" />
            評価 {post.owner_average_rating?.toFixed(1) ?? "-"}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} aria-hidden="true" />
            完了 {post.owner_completed_count ?? 0}件
          </span>
          {post.owner_shipping_preference === "anonymous_only" ? (
            <span className="flex items-center gap-1">
              <Truck size={15} aria-hidden="true" />
              匿名のみ
            </span>
          ) : post.owner_shipping_preference === "disclose_preferred" ? (
            <span className="flex items-center gap-1">
              <Truck size={15} aria-hidden="true" />
              氏名開示希望
            </span>
          ) : null}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1 text-sm font-semibold text-stone-950">
        詳細
        <ArrowRight size={15} aria-hidden="true" />
      </div>
    </Link>
  );
}


function OfferPanel({ items }: { items: PublicTradePostOfferItem[] }) {
  const visibleItems = items.slice(0, 2);
  const extraCount = Math.max(items.length - visibleItems.length, 0);

  return (
    <section className="grid gap-2 rounded-md bg-stone-50 p-3">
      <p className="text-xs font-bold text-stone-500">出る</p>
      {visibleItems.map((item) => (
        <BottleLine key={item.id} item={item} kind="offer" />
      ))}
      {extraCount ? (
        <p className="text-xs text-stone-500">ほか {extraCount}件</p>
      ) : null}
    </section>
  );
}

function WantPanel({
  items,
  primaryWant,
}: {
  items: PublicTradePostWantItem[];
  primaryWant: PublicTradePostWantItem | undefined;
}) {
  const visibleItems = items.slice(0, 2);
  const extraCount = Math.max(items.length - visibleItems.length, 0);

  return (
    <section className="grid gap-2 rounded-md bg-stone-50 p-3">
      <p className="text-xs font-bold text-stone-500">求む</p>
      {visibleItems.length ? (
        visibleItems.map((item) => (
          <BottleLine key={item.id} item={item} kind="want" />
        ))
      ) : (
        <p className="text-sm font-semibold text-stone-950">提案歓迎</p>
      )}
      {primaryWant?.condition_note ? (
        <p className="line-clamp-1 text-xs text-stone-600">
          {primaryWant.condition_note}
        </p>
      ) : null}
      {extraCount ? (
        <p className="text-xs text-stone-500">ほか {extraCount}件</p>
      ) : null}
    </section>
  );
}

function BottleLine({
  item,
  kind,
}: {
  item: PublicTradePostOfferItem | PublicTradePostWantItem;
  kind: "offer" | "want";
}) {
  const subline = bottleSubline(item);

  return (
    <div className="min-w-0">
      <p className="line-clamp-2 text-base font-bold leading-snug text-stone-950">
        {item.display_bottle_name ?? "名称未設定のボトル"}
      </p>
      {subline ? (
        <p className="mt-0.5 line-clamp-1 text-xs text-stone-600">{subline}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1 text-xs text-stone-700">
        {item.median_price != null ? (
          <span className="rounded bg-white px-2 py-1">
            {formatPrice(item.median_price)}
          </span>
        ) : null}
        {kind === "offer" && "box_condition" in item ? (
          <>
            <span className="rounded bg-white px-2 py-1">
              {formatBoxCondition(item.box_condition)}
            </span>
            <span className="rounded bg-white px-2 py-1">
              ラベル {formatLabelCondition(item.label_condition)}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
