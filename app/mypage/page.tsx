import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HandHeart,
  Inbox,
  LogOut,
  PlusCircle,
  Send,
  Settings,
  Star,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { MyTradePostList } from "@/components/posts/my-trade-post-list";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { logoutAction } from "@/lib/actions/auth-actions";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import {
  getReceivedInterests,
  getSentInterests,
} from "@/lib/data/interests";
import { formatDate } from "@/lib/format/trade";
import { getMyTradePosts } from "@/lib/data/trade-posts";
import type { TradeInterestListItem, TradeInterestStatus } from "@/lib/types/interests";

const tradeStatusLabels: Record<TradeInterestStatus, string> = {
  interested: "確認待ち",
  consulting: "相談中",
  dismissed: "見送り",
  canceled: "キャンセル済み",
  completion_requested: "完了確認中",
  completed: "完了",
};

type MyPageProps = {
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export default async function MyPage({ searchParams }: MyPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage");

  const [tradePosts, sentInterests, receivedInterests] = await Promise.all([
    getMyTradePosts(),
    getSentInterests(),
    getReceivedInterests(),
  ]);
  const allInterests = [...sentInterests.data, ...receivedInterests.data];
  const receivedWaiting = receivedInterests.data.filter(
    (interest) => interest.status === "interested",
  );
  const sentWaiting = sentInterests.data.filter(
    (interest) => interest.status === "interested",
  );
  const activeTrades = allInterests.filter((interest) =>
    ["consulting", "completion_requested"].includes(interest.status),
  );
  const completedTrades = allInterests.filter(
    (interest) => interest.status === "completed",
  );
  const visibleTrades = [...activeTrades, ...completedTrades]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 6);

  return (
    <PageShell>
      <section className="grid gap-8">
        <div className="flex flex-col gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">My page</p>
            <h1 className="mt-1 text-3xl font-semibold">マイページ</h1>
            <p className="mt-3 max-w-2xl text-stone-700">
              交換投稿、興味あり、進行中の取引をここから確認できます。
              X IDは相談開始後の取引詳細でのみ表示されます。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/mypage/posts/new" className="gap-2">
              <PlusCircle size={16} aria-hidden="true" />
              交換投稿を作る
            </ButtonLink>
            <ButtonLink href="/posts" variant="secondary" className="gap-2">
              交換投稿を探す
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryLink
            href="/mypage/interests/received"
            icon={<Inbox size={18} aria-hidden="true" />}
            label="届いた興味あり"
            value={receivedInterests.data.length}
            note={
              receivedWaiting.length
                ? `${receivedWaiting.length}件が確認待ち`
                : "確認待ちはありません"
            }
          />
          <SummaryLink
            href="/mypage/interests/sent"
            icon={<Send size={18} aria-hidden="true" />}
            label="送った興味あり"
            value={sentInterests.data.length}
            note={
              sentWaiting.length
                ? `${sentWaiting.length}件が相手の確認待ち`
                : "未確認の送信分はありません"
            }
          />
          <SummaryLink
            href="#active-trades"
            icon={<Clock size={18} aria-hidden="true" />}
            label="進行中取引"
            value={activeTrades.length}
            note="相談中・完了確認中"
          />
          <SummaryLink
            href="#active-trades"
            icon={<CheckCircle2 size={18} aria-hidden="true" />}
            label="完了取引"
            value={completedTrades.length}
            note="評価投稿へ進めます"
          />
        </div>

        <DataStatusNote
          isConfigured={
            tradePosts.isConfigured &&
            sentInterests.isConfigured &&
            receivedInterests.isConfigured
          }
          error={
            tradePosts.error ??
            sentInterests.error ??
            receivedInterests.error
          }
        />

        <MyItemUpdateMessage updated={params.updated} error={params.error} />

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Trade posts</p>
              <h2 className="mt-1 text-2xl font-semibold">自分の交換投稿</h2>
              <p className="mt-1 text-sm text-stone-600">
                出る / 求むを1つの投稿として管理します。
              </p>
            </div>
            <ButtonLink href="/mypage/posts/new" variant="secondary" className="gap-2">
              <PlusCircle size={16} aria-hidden="true" />
              交換投稿を作る
            </ButtonLink>
          </div>

          {tradePosts.data.length ? (
            <MyTradePostList posts={tradePosts.data} />
          ) : (
            <EmptyState
              title="交換投稿はまだありません"
              text="出るボトルと求む条件をまとめて、最初の交換投稿を作りましょう。"
              href="/mypage/posts/new"
              label="交換投稿を作る"
            />
          )}
        </section>

        <InterestAccessSection
          sentInterests={sentInterests.data}
          receivedInterests={receivedInterests.data}
        />

        <section className="grid gap-3 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-stone-500">Account</p>
            <h2 className="mt-1 text-2xl font-semibold">アカウント</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/settings/profile"
              className="flex items-center gap-3 rounded-md border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-white"
            >
              <Settings size={16} aria-hidden="true" />
              プロフィール設定
            </Link>
            <form action={logoutAction}>
              <button
                className="flex w-full items-center gap-3 rounded-md border border-stone-200 bg-stone-50 p-4 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-white"
              >
                <LogOut size={16} aria-hidden="true" />
                ログアウト
              </button>
            </form>
          </div>
          <p className="flex items-center justify-between text-sm text-stone-500">
            <span>アカウントを使わなくなった場合は退会できます。</span>
            <Link
              href="/settings/account/delete"
              className="text-rose-700 underline underline-offset-2 hover:text-rose-900"
            >
              アカウントを削除する
            </Link>
          </p>
        </section>

        <section id="active-trades" className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">Trades</p>
              <h2 className="mt-1 text-2xl font-semibold">進行中/完了取引</h2>
            </div>
            <ButtonLink href="/mypage/interests/sent" variant="secondary">
              興味あり一覧へ
            </ButtonLink>
          </div>

          {visibleTrades.length ? (
            <div className="grid gap-3">
              {visibleTrades.map((interest) => (
                <TradeRow key={interest.id} interest={interest} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="進行中の取引はまだありません"
              text="届いた興味ありから相談開始するか、気になる交換投稿に興味ありを送ると取引詳細が作られます。"
              href="/posts"
              label="交換投稿を探す"
            />
          )}
        </section>
      </section>
    </PageShell>
  );
}

function SummaryLink({
  href,
  icon,
  label,
  value,
  note,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  note: string;
}) {
  return (
    <Link
      href={href}
      className="grid gap-3 rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm transition hover:border-stone-300 hover:bg-white"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-stone-100 text-stone-800">
          {icon}
        </span>
        <ArrowRight size={16} className="text-stone-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-stone-500">{label}</p>
        <p className="mt-1 text-3xl font-semibold">{value}</p>
        <p className="mt-1 text-sm text-stone-600">{note}</p>
      </div>
    </Link>
  );
}



function MyItemUpdateMessage({
  updated,
  error,
}: {
  updated?: string;
  error?: string;
}) {
  const messages: Record<string, string> = {
    post_private: "交換投稿の受付を停止しました。",
    post_public: "交換投稿を再公開しました。",
    post_updated: "交換投稿を更新しました。",
  };

  if (!updated && !error) {
    return null;
  }

  return (
    <div className="grid gap-2">
      {updated && messages[updated] ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {messages[updated]}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function InterestAccessSection({
  sentInterests,
  receivedInterests,
}: {
  sentInterests: TradeInterestListItem[];
  receivedInterests: TradeInterestListItem[];
}) {
  const receivedWaiting = receivedInterests.filter(
    (interest) => interest.status === "interested",
  ).length;
  const sentWaiting = sentInterests.filter(
    (interest) => interest.status === "interested",
  ).length;

  return (
    <section className="grid gap-4">
      <div>
        <p className="text-sm font-medium text-stone-500">Interests</p>
        <h2 className="mt-1 text-2xl font-semibold">興味あり</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <InterestAccessCard
          href="/mypage/interests/received"
          icon={<Inbox size={18} aria-hidden="true" />}
          title="受け取った興味あり"
          text={
            receivedWaiting
              ? `${receivedWaiting}件が相談開始または見送りの確認待ちです。`
              : "届いた興味ありの履歴を確認できます。"
          }
          count={receivedInterests.length}
        />
        <InterestAccessCard
          href="/mypage/interests/sent"
          icon={<HandHeart size={18} aria-hidden="true" />}
          title="送った興味あり"
          text={
            sentWaiting
              ? `${sentWaiting}件が相手の確認待ちです。`
              : "送信済み、相談開始済み、見送り済みを確認できます。"
          }
          count={sentInterests.length}
        />
      </div>
    </section>
  );
}

function InterestAccessCard({
  href,
  icon,
  title,
  text,
  count,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-4 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm transition hover:border-stone-300 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-800">
          {icon}
        </span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-stone-600">{text}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="text-2xl font-semibold">{count}</span>
        <ArrowRight size={16} className="text-stone-400" aria-hidden="true" />
      </div>
    </Link>
  );
}

function TradeRow({ interest }: { interest: TradeInterestListItem }) {
  return (
    <Link
      href={`/trades/${interest.id}`}
      className="grid gap-3 rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm transition hover:border-stone-300 hover:bg-white sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={tradeStatusLabels[interest.status]} />
          <p className="text-xs font-medium text-stone-500">
            {formatDate(interest.created_at)}
          </p>
        </div>
        <h3 className="mt-2 font-semibold">
          {interest.target?.display_bottle_name ?? "対象ボトル"}
        </h3>
        <p className="mt-1 text-sm text-stone-600">
          候補:{" "}
          {interest.proposedOffer?.display_bottle_name ?? "名称未設定のボトル"}
        </p>
      </div>
      <span className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-3 text-sm font-semibold text-stone-950">
        詳細
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}

function EmptyState({
  title,
  text,
  href,
  label,
}: {
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-stone-300 bg-white/62 p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-700">
          <Star size={17} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-stone-600">{text}</p>
          <ButtonLink href={href} variant="secondary" className="mt-4 gap-2">
            {label}
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-md bg-stone-100 px-2.5 text-xs font-semibold text-stone-700">
      {label}
    </span>
  );
}
