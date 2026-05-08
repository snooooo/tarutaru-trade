import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Star, Truck } from "lucide-react";
import { LikeButton } from "@/components/posts/like-button";
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

export function TradePostCard({
  post,
  likeCount = 0,
  isLiked = false,
}: {
  post: PublicTradePost;
  likeCount?: number;
  isLiked?: boolean;
}) {
  const primaryWant = post.want_items[0];
  const isClosed = post.status === "closed";
  // closed 投稿では新規いいね不可。既いいねの場合のみハートを出して解除を許可。
  const showLike = !isClosed || isLiked;
  const loginHref = `/login?next=${encodeURIComponent(`/posts/${post.id}`)}`;

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group grid gap-3 rounded-md border border-stone-200 bg-white/88 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white hover:shadow-md sm:p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isClosed ? (
            <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
              取引終了
            </span>
          ) : null}
          <p className="text-xs font-medium text-stone-500">
            {formatDate(post.published_at ?? post.created_at)}
          </p>
        </div>
        {showLike ? (
          <LikeButton
            postId={post.id}
            initialLiked={isLiked}
            initialCount={likeCount}
            loginHref={loginHref}
            disabled={isClosed && !isLiked}
            stopPropagation
            size="sm"
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <OfferPanel items={post.offer_items} />
        <WantPanel items={post.want_items} primaryWant={primaryWant} />
      </div>

      {!isClosed && post.condition_note ? (
        <p className="line-clamp-2 text-sm leading-6 text-stone-700">
          {post.condition_note}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-sm text-stone-600">
        {isClosed ? (
          <span className="min-w-0 truncate text-stone-500">
            {formatDate(post.closed_at ?? post.published_at ?? post.created_at)}に取引終了
          </span>
        ) : (
          <>
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
              {post.owner_shipping_region ? (
                <span className="flex items-center gap-1">
                  <MapPin size={14} aria-hidden="true" />
                  {post.owner_shipping_region}
                </span>
              ) : null}
              {post.owner_shipping_preference === "anonymous_only" ? (
                <span className="flex items-center gap-1">
                  <Truck size={15} aria-hidden="true" />
                  匿名配送
                </span>
              ) : post.owner_shipping_preference === "disclose_preferred" ? (
                <span className="flex items-center gap-1">
                  <Truck size={15} aria-hidden="true" />
                  配送住所等開示希望
                </span>
              ) : null}
            </span>
          </>
        )}
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
      <p className="text-sm font-bold text-stone-500">出</p>
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
      <p className="text-sm font-bold text-stone-500">求</p>
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
