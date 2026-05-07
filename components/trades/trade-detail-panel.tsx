import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  ExternalLink,
  MapPin,
  RotateCcw,
  Star,
  Truck,
} from "lucide-react";
import { XIdCopyButton } from "./x-id-copy-button";
import {
  cancelInterestAction,
  dismissInterestAction,
  markTradeCompletedAction,
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
  TradeInterestDetailItem,
  TradeInterestStatus,
} from "@/lib/types/interests";
import type { PublicTradePost } from "@/lib/types/trade-posts";

const statusLabels: Record<TradeInterestStatus, string> = {
  interested: "確認待ち",
  consulting: "相談中",
  dismissed: "見送り",
  canceled: "キャンセル済み",
  completion_requested: "完了確認中",
  completed: "完了",
};

export function TradeDetailPanel({
  trade,
}: {
  trade: TradeInterestDetailItem;
}) {
  const canShowXId = Boolean(trade.counterparty?.x_id);
  const canStartConsulting =
    trade.status === "interested" && trade.user_role === "receiver";
  const canDismiss =
    trade.status === "interested" && trade.user_role === "receiver";
  const canCancel =
    trade.status === "interested" ||
    trade.status === "consulting" ||
    trade.status === "completion_requested";
  const canComplete =
    trade.status === "consulting" || trade.status === "completion_requested";
  const myCompletedAt =
    trade.user_role === "requester"
      ? trade.requester_completed_at
      : trade.receiver_completed_at;
  const counterpartyCompletedAt =
    trade.user_role === "requester"
      ? trade.receiver_completed_at
      : trade.requester_completed_at;

  return (
    <article className="grid gap-6">
      <section className="grid gap-4 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">
              Trade detail / {formatDate(trade.created_at)}
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              {statusLabels[trade.status]}
            </h1>
          </div>
          <StatusPill status={trade.status} />
        </div>

        <StatusMessage
          trade={trade}
          myCompletedAt={myCompletedAt}
          counterpartyCompletedAt={counterpartyCompletedAt}
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {trade.targetPost ? (
          <TradePostPanel
            label={trade.user_role === "requester" ? "相手の投稿" : "あなたの投稿"}
            post={trade.targetPost}
          />
        ) : (
          <BottlePanel
            label={trade.user_role === "requester" ? "相手の対象" : "あなたの対象"}
            bottle={trade.target}
          />
        )}
        <BottleListPanel
          label={trade.user_role === "requester" ? "あなたの候補" : "相手の候補"}
          bottles={
            trade.proposalOfferItems.length
              ? trade.proposalOfferItems
              : trade.proposedOffer
                ? [trade.proposedOffer]
                : []
          }
        />
      </section>

      <CounterpartyPanel counterparty={trade.counterparty} canShowXId={canShowXId} />

      <section className="grid gap-4 rounded-md border border-stone-200 bg-white/82 p-5">
        {canStartConsulting ? (
          <div className="rounded-md bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <p className="font-semibold">取引を始める前に</p>
            <p className="mt-1">
              まずは相手のXアカウントを確認し、取引を進めるかどうかご自身で判断してください。
            </p>
            <p className="mt-1">
              見送りになっても、急な体調不良や仕事の都合など、それぞれに事情があります。
              理由を聞いたり責めたりせず、寛大にご対応願います。
            </p>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {canStartConsulting ? (
          <ActionForm
            action={startConsultingInterestAction}
            interestId={trade.id}
            redirectTo={`/trades/${trade.id}`}
            label="相談開始"
            icon={<ArrowRight size={16} aria-hidden="true" />}
            primary
          />
        ) : null}
        {canDismiss ? (
          <ActionForm
            action={dismissInterestAction}
            interestId={trade.id}
            redirectTo={`/trades/${trade.id}`}
            label="見送る"
            icon={<Ban size={16} aria-hidden="true" />}
          />
        ) : null}
        {trade.status === "interested" && trade.user_role === "requester" ? (
          <ActionForm
            action={cancelInterestAction}
            interestId={trade.id}
            redirectTo={`/trades/${trade.id}`}
            label="取り下げる"
            icon={<RotateCcw size={16} aria-hidden="true" />}
          />
        ) : null}
        {canCancel && trade.status !== "interested" ? (
          <ActionForm
            action={cancelInterestAction}
            interestId={trade.id}
            redirectTo={`/trades/${trade.id}`}
            label="キャンセルする"
            icon={<RotateCcw size={16} aria-hidden="true" />}
          />
        ) : null}
        {canComplete && !myCompletedAt ? (
          <ActionForm
            action={markTradeCompletedAction}
            interestId={trade.id}
            redirectTo={`/trades/${trade.id}`}
            label="取引完了にする"
            icon={<CheckCircle2 size={16} aria-hidden="true" />}
            primary
          />
        ) : null}
        {trade.status === "completed" && !trade.has_reviewed ? (
          <Link
            href={`/trades/${trade.id}/review`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Star size={16} aria-hidden="true" />
            評価する
          </Link>
        ) : null}
        {trade.status === "completed" && trade.has_reviewed ? (
          <p className="flex min-h-11 items-center text-sm font-medium text-stone-600">
            評価済みです。
          </p>
        ) : null}
        </div>
      </section>
    </article>
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
        active ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-700"
      }`}
    >
      <CheckCircle2 size={15} aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

function StatusMessage({
  trade,
  myCompletedAt,
  counterpartyCompletedAt,
}: {
  trade: TradeInterestDetailItem;
  myCompletedAt: string | null;
  counterpartyCompletedAt: string | null;
}) {
  if (trade.status === "completion_requested") {
    return (
      <div className="grid gap-2 rounded-md bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">片方の完了確認が済んでいます。</p>
        <p>あなた: {myCompletedAt ? `${formatDate(myCompletedAt)} 確認済み` : "未確認"}</p>
        <p>
          相手:{" "}
          {counterpartyCompletedAt
            ? `${formatDate(counterpartyCompletedAt)} 確認済み`
            : "未確認"}
        </p>
      </div>
    );
  }

  if (trade.status === "completed") {
    return (
      <p className="rounded-md bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
        {formatDate(trade.completed_at)} に双方の完了確認が揃いました。
      </p>
    );
  }

  if (trade.status === "dismissed") {
    return (
      <p className="rounded-md bg-stone-50 p-4 text-sm text-stone-700">
        この興味ありは見送り済みです。X IDは表示されません。
      </p>
    );
  }

  if (trade.status === "canceled") {
    return (
      <p className="rounded-md bg-stone-50 p-4 text-sm text-stone-700">
        この取引はキャンセル済みです。
      </p>
    );
  }

  return (
    <p className="rounded-md bg-stone-50 p-4 text-sm text-stone-700">
      {trade.status === "interested"
        ? "相談開始前のため、相手のX IDは表示されません。"
        : "X DMで相談し、取引が終わったら双方で完了確認をしてください。"}
    </p>
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
    <section className="rounded-md border border-stone-200 bg-white/82 p-5">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <h2 className="mt-1 text-xl font-semibold">
        {post.title || offer?.display_bottle_name || "トレード投稿"}
      </h2>
      <div className="mt-4 grid gap-3">
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-sm font-medium text-stone-500">出</p>
          <p className="mt-1 font-semibold">
            {offer?.display_bottle_name ?? "名称未設定のボトル"}
          </p>
          {offer ? (
            <p className="mt-1 text-sm text-stone-600">
              {bottleSubline(offer) || "MaltPeri情報なし"}
            </p>
          ) : null}
        </div>
        <div className="rounded-md bg-stone-50 p-3">
          <p className="text-sm font-medium text-stone-500">求</p>
          <p className="mt-1 font-semibold">
            {want?.display_bottle_name ?? "提案歓迎"}
          </p>
          {want ? (
            <p className="mt-1 text-sm text-stone-600">
              {bottleSubline(want) || "MaltPeri情報なし"}
            </p>
          ) : null}
        </div>
      </div>
      {post.condition_note ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {post.condition_note}
        </p>
      ) : null}
    </section>
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
    <section className="rounded-md border border-stone-200 bg-white/82 p-5">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <h2 className="mt-1 text-xl font-semibold">
        {bottle?.display_bottle_name ?? "名称未設定のボトル"}
      </h2>
      {bottle ? (
        <>
          <p className="mt-2 text-sm text-stone-600">
            {bottleSubline(bottle) || "MaltPeri情報なし"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-700">
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
            {bottle.condition_note ? (
              <span className="rounded bg-stone-50 px-2 py-1">
                希望条件 {bottle.condition_note}
              </span>
            ) : null}
            <span className="rounded bg-stone-50 px-2 py-1">
              {formatPrice(bottle.median_price)}
            </span>
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-stone-600">詳細を読み込めませんでした。</p>
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
    <section className="rounded-md border border-stone-200 bg-white/82 p-5">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      {bottles.length ? (
        <div className="mt-3 grid gap-3">
          {bottles.map((bottle, index) => (
            <div key={bottle.id} className="rounded-md bg-stone-50 p-3">
              <p className="text-xs font-medium text-stone-500">
                候補 {index + 1}
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                {bottle.display_bottle_name ?? "名称未設定のボトル"}
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                {bottleSubline(bottle) || "MaltPeri情報なし"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-stone-700">
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
                {bottle.note ? (
                  <span className="rounded bg-white px-2 py-1">
                    備考 {bottle.note}
                  </span>
                ) : null}
                <span className="rounded bg-white px-2 py-1">
                  {formatPrice(bottle.median_price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-stone-600">詳細を読み込めませんでした。</p>
      )}
    </section>
  );
}

function CounterpartyPanel({
  counterparty,
  canShowXId,
}: {
  counterparty: InterestCounterpartySummary | null;
  canShowXId: boolean;
}) {
  const xId = counterparty?.x_id ?? null;
  const normalizedXId = xId?.replace(/^@/, "") ?? null;

  return (
    <section className="rounded-md border border-stone-200 bg-white/82 p-5">
      <p className="text-xs font-medium text-stone-500">相手プロフィール</p>
      <h2 className="mt-1 text-xl font-semibold">
        {counterparty?.display_name ?? "ななしさん"}
      </h2>
      <div className="mt-4 grid gap-2 text-sm text-stone-700 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <Star size={15} aria-hidden="true" />
          評価 {counterparty?.owner_average_rating?.toFixed(1) ?? "-"} /{" "}
          {counterparty?.owner_review_count ?? 0}件
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 size={15} aria-hidden="true" />
          完了 {counterparty?.owner_completed_count ?? 0}件
        </span>
        {counterparty?.owner_shipping_region ? (
          <span className="flex items-center gap-2">
            <MapPin size={15} aria-hidden="true" />
            {counterparty.owner_shipping_region}
          </span>
        ) : null}
        <span className="flex items-center gap-2">
          <Truck size={15} aria-hidden="true" />
          {counterparty?.owner_shipping_preference === "anonymous_only"
            ? "配送先住所等を知らせたくない"
            : counterparty?.owner_shipping_preference === "disclose_preferred"
              ? "住所等を開示して取引したい"
              : "配送方法は相談して決めたい"}
        </span>
        <span>{formatFollowersRange(counterparty?.owner_x_followers_range)}</span>
      </div>

      {canShowXId && normalizedXId ? (
        <div className="mt-5 rounded-md bg-stone-50 p-4">
          <p className="text-xs font-medium text-stone-500">X ID</p>
          <a
            href={`https://x.com/${encodeURIComponent(normalizedXId)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-lg font-semibold underline-offset-2 hover:underline"
          >
            @{normalizedXId}
          </a>
          <div className="mt-3 flex flex-wrap gap-2">
            <XIdCopyButton xId={normalizedXId} />
            <a
              href={`https://x.com/${encodeURIComponent(normalizedXId)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              XプロフィールでDMへ
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-stone-50 p-4 text-sm text-stone-600">
          X IDは相談開始後の取引画面でのみ表示されます。
        </p>
      )}
    </section>
  );
}

function ActionForm({
  action,
  interestId,
  redirectTo,
  label,
  icon,
  primary = false,
}: {
  action: (formData: FormData) => Promise<void>;
  interestId: string;
  redirectTo: string;
  label: string;
  icon: ReactNode;
  primary?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="interest_id" value={interestId} />
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <button
        className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition sm:w-auto ${
          primary
            ? "bg-stone-950 text-white hover:bg-stone-800"
            : "border border-stone-300 bg-white/70 text-stone-950 hover:bg-white"
        }`}
      >
        {icon}
        {label}
      </button>
    </form>
  );
}
