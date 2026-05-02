import Link from "next/link";
import { ArrowRight, Ban, CheckCircle2, Clock, RotateCcw, Star, Truck } from "lucide-react";
import {
  cancelInterestAction,
  dismissInterestAction,
  startConsultingInterestAction,
} from "@/lib/actions/interest-actions";
import {
  bottleSubline,
  formatBoxCondition,
  formatDate,
  formatFollowersRange,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";
import type {
  InterestCounterpartySummary,
  TradeBottleSummary,
  TradeInterestListItem,
  TradeInterestStatus,
} from "@/lib/types/interests";
import type { PublicTradePost } from "@/lib/types/trade-posts";

type InterestListCardsProps = {
  interests: TradeInterestListItem[];
  direction: "sent" | "received";
};

const statusLabels: Record<TradeInterestStatus, string> = {
  interested: "確認待ち",
  consulting: "相談開始済み",
  dismissed: "見送り",
  canceled: "取り下げ・キャンセル",
  completion_requested: "完了確認中",
  completed: "完了",
};

export function InterestListCards({
  interests,
  direction,
}: InterestListCardsProps) {
  if (!interests.length) {
    return (
      <div className="grid gap-4 rounded-md border border-dashed border-stone-300 bg-white/62 p-6 text-stone-700">
        <div>
          <h2 className="font-semibold text-stone-950">
            {direction === "sent"
              ? "送った興味ありはまだありません"
              : "届いた興味ありはまだありません"}
          </h2>
          <p className="mt-1 text-sm">
            {direction === "sent"
              ? "気になる交換投稿から、交換候補のボトルを選んで興味ありを送れます。"
              : "自分の交換投稿に興味ありが届くと、ここから相談開始または見送りを選べます。"}
          </p>
        </div>
        <Link
          href={direction === "sent" ? "/posts" : "/mypage"}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-4 text-sm font-semibold text-stone-950 transition hover:bg-white sm:w-fit"
        >
          {direction === "sent" ? "交換投稿を探す" : "マイページへ戻る"}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {interests.map((interest) => (
        <article
          key={interest.id}
          className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">
                {formatDate(interest.created_at)}
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {statusLabels[interest.status]}
              </h2>
            </div>
            <StatusPill status={interest.status} />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {interest.targetPost ? (
              <TradePostPanel
                label={direction === "sent" ? "相手の投稿" : "あなたの投稿"}
                post={interest.targetPost}
              />
            ) : (
              <BottlePanel
                label={direction === "sent" ? "相手の対象" : "あなたの対象"}
                bottle={interest.target}
              />
            )}
            <BottleListPanel
              label={direction === "sent" ? "あなたの候補" : "相手の候補"}
              bottles={
                interest.proposalOfferItems.length
                  ? interest.proposalOfferItems
                  : interest.proposedOffer
                    ? [interest.proposedOffer]
                    : []
              }
            />
          </div>

          <ProfilePanel
            counterparty={interest.counterparty}
            label={direction === "sent" ? "相手プロフィール" : "相手プロフィール"}
          />

          {direction === "received" && interest.status === "interested" ? (
            <div className="flex flex-col gap-2 border-t border-stone-100 pt-4 sm:flex-row">
              <form action={startConsultingInterestAction}>
                <input type="hidden" name="interest_id" value={interest.id} />
                <input
                  type="hidden"
                  name="redirect_to"
                  value="/mypage/interests/received"
                />
                <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 sm:w-auto">
                  トレード相談フェーズに進む
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </form>
              <form action={dismissInterestAction}>
                <input type="hidden" name="interest_id" value={interest.id} />
                <input
                  type="hidden"
                  name="redirect_to"
                  value="/mypage/interests/received"
                />
                <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-4 text-sm font-semibold text-stone-950 transition hover:bg-white sm:w-auto">
                  <Ban size={16} aria-hidden="true" />
                  見送る
                </button>
              </form>
            </div>
          ) : null}

          {direction === "sent" && interest.status === "interested" ? (
            <div className="border-t border-stone-100 pt-4">
              <form action={cancelInterestAction}>
                <input type="hidden" name="interest_id" value={interest.id} />
                <input
                  type="hidden"
                  name="redirect_to"
                  value="/mypage/interests/sent"
                />
                <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-4 text-sm font-semibold text-stone-950 transition hover:bg-white">
                  <RotateCcw size={16} aria-hidden="true" />
                  取り下げる
                </button>
              </form>
            </div>
          ) : null}

          {interest.status !== "interested" ? (
            <div className="border-t border-stone-100 pt-4">
              <Link
                href={`/trades/${interest.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-4 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                取引詳細へ
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function TradePostPanel({
  label,
  post,
}: {
  label: string;
  post: PublicTradePost;
}) {
  const offer = post.offer_items[0];
  const want = post.want_items[0];

  return (
    <section className="rounded-md bg-stone-50 p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <h3 className="mt-1 font-semibold">
        {post.title || offer?.display_bottle_name || "交換投稿"}
      </h3>
      <div className="mt-3 grid gap-2 text-sm">
        <div>
          <p className="text-xs font-medium text-stone-500">出る</p>
          <p className="mt-0.5 font-semibold">
            {offer?.display_bottle_name ?? "名称未設定のボトル"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-stone-500">求む</p>
          <p className="mt-0.5 font-semibold">
            {want?.display_bottle_name ?? "提案歓迎"}
          </p>
        </div>
      </div>
      {post.condition_note ? (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-700">
          {post.condition_note}
        </p>
      ) : null}
    </section>
  );
}

function StatusPill({ status }: { status: TradeInterestStatus }) {
  const active =
    status === "interested" ||
    status === "consulting" ||
    status === "completion_requested";

  return (
    <span
      className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "bg-stone-100 text-stone-700"
      }`}
    >
      {active ? (
        <Clock size={15} aria-hidden="true" />
      ) : (
        <CheckCircle2 size={15} aria-hidden="true" />
      )}
      {statusLabels[status]}
    </span>
  );
}

function BottlePanel({
  label,
  bottle,
}: {
  label: string;
  bottle: TradeBottleSummary | null;
}) {
  return (
    <section className="rounded-md bg-stone-50 p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <h3 className="mt-1 font-semibold">
        {bottle?.display_bottle_name ?? "名称未設定のボトル"}
      </h3>
      {bottle ? (
        <>
          <p className="mt-1 text-sm text-stone-600">
            {bottleSubline(bottle) || "MaltPeri情報なし"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-700">
            {bottle.box_condition ? (
              <span className="rounded bg-white px-2 py-1">
                {formatBoxCondition(bottle.box_condition)}
              </span>
            ) : null}
            {bottle.label_condition ? (
              <span className="rounded bg-white px-2 py-1">
                ラベル {formatLabelCondition(bottle.label_condition)}
              </span>
            ) : null}
            <span className="rounded bg-white px-2 py-1">
              {formatPrice(bottle.median_price)}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-1 text-sm text-stone-600">詳細を読み込めませんでした。</p>
      )}
    </section>
  );
}

function BottleListPanel({
  label,
  bottles,
}: {
  label: string;
  bottles: TradeBottleSummary[];
}) {
  return (
    <section className="rounded-md bg-stone-50 p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      {bottles.length ? (
        <div className="mt-2 grid gap-3">
          {bottles.map((bottle, index) => (
            <div key={bottle.id} className="rounded-md bg-white p-3">
              <p className="text-xs font-medium text-stone-500">
                候補 {index + 1}
              </p>
              <h3 className="mt-1 font-semibold">
                {bottle.display_bottle_name ?? "名称未設定のボトル"}
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                {bottleSubline(bottle) || "MaltPeri情報なし"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-700">
                {bottle.box_condition ? (
                  <span className="rounded bg-stone-50 px-2 py-1">
                    {formatBoxCondition(bottle.box_condition)}
                  </span>
                ) : null}
                {bottle.label_condition ? (
                  <span className="rounded bg-stone-50 px-2 py-1">
                    ラベル {formatLabelCondition(bottle.label_condition)}
                  </span>
                ) : null}
                <span className="rounded bg-stone-50 px-2 py-1">
                  {formatPrice(bottle.median_price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-stone-600">詳細を読み込めませんでした。</p>
      )}
    </section>
  );
}

function ProfilePanel({
  counterparty,
  label,
}: {
  counterparty: InterestCounterpartySummary | null;
  label: string;
}) {
  return (
    <section className="rounded-md border border-stone-100 p-4">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <h3 className="mt-1 font-semibold">
        {counterparty?.display_name ?? "ななしさん"}
      </h3>
      <div className="mt-3 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <Star size={15} aria-hidden="true" />
          評価 {counterparty?.owner_average_rating?.toFixed(1) ?? "-"} /{" "}
          {counterparty?.owner_review_count ?? 0}件
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 size={15} aria-hidden="true" />
          完了 {counterparty?.owner_completed_count ?? 0}件
        </span>
        <span className="flex items-center gap-2">
          <Truck size={15} aria-hidden="true" />
          {counterparty?.owner_anonymous_shipping_ok
            ? "匿名配送OK"
            : "匿名配送未設定"}
        </span>
        <span>{formatFollowersRange(counterparty?.owner_x_followers_range)}</span>
      </div>
      <p className="mt-3 text-xs text-stone-500">
        X IDは相談開始後の取引画面でのみ表示されます。
      </p>
    </section>
  );
}
