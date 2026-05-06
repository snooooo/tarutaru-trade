import { Suspense } from "react";
import Link from "next/link";
import {
  AlertCircle,
  KeyRound,
  LogOut,
  PlusCircle,
  Settings,
  Star,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { MyTradePostList } from "@/components/posts/my-trade-post-list";
import { MyPageTabs } from "@/components/mypage/mypage-tabs";
import { InteractionsList } from "@/components/mypage/interactions-list";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { logoutAction } from "@/lib/actions/auth-actions";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import {
  getReceivedInterests,
  getSentInterests,
} from "@/lib/data/interests";
import { getMyTradePosts } from "@/lib/data/trade-posts";

type MyPageProps = {
  searchParams: Promise<{ tab?: string; updated?: string; error?: string }>;
};

export default async function MyPage({ searchParams }: MyPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage");

  const [tradePosts, sentInterests, receivedInterests] = await Promise.all([
    getMyTradePosts(),
    getSentInterests(),
    getReceivedInterests(),
  ]);

  // Count items needing user action
  const receivedWaitingCount = receivedInterests.data.filter(
    (i) => i.status === "interested",
  ).length;
  const completionPendingCount = [
    ...sentInterests.data,
    ...receivedInterests.data,
  ].filter((i) => i.status === "completion_requested").length;
  const actionCount = receivedWaitingCount + completionPendingCount;

  return (
    <PageShell>
      <section className="grid gap-6">
        {/* Header */}
        <div className="flex flex-col gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">My page</p>
            <h1 className="mt-1 text-3xl font-semibold">マイページ</h1>
            {actionCount > 0 ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
                <AlertCircle size={15} aria-hidden="true" />
                対応待ち: {actionCount}件
              </p>
            ) : (
              <p className="mt-3 text-sm text-stone-500">
                対応待ちはありません
              </p>
            )}
          </div>
          <ButtonLink href="/mypage/posts/new" className="gap-2">
            <PlusCircle size={16} aria-hidden="true" />
            交換投稿を作る
          </ButtonLink>
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

        {/* Tabs */}
        <Suspense>
          <MyPageTabs>
            {{
              posts: (
                <PostsTab
                  posts={tradePosts.data}
                />
              ),
              interactions: (
                <InteractionsTab
                  sent={sentInterests.data}
                  received={receivedInterests.data}
                />
              ),
              account: <AccountTab />,
            }}
          </MyPageTabs>
        </Suspense>
      </section>
    </PageShell>
  );
}

/* ─── Tab content components ─── */

function PostsTab({ posts }: { posts: Parameters<typeof MyTradePostList>[0]["posts"] }) {
  return (
    <section className="grid gap-4 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">自分の交換投稿</h2>
          <p className="mt-1 text-sm text-stone-600">
            出る / 求むを1つの投稿として管理します。
          </p>
        </div>
        <ButtonLink href="/mypage/posts/new" variant="secondary" className="gap-2">
          <PlusCircle size={16} aria-hidden="true" />
          交換投稿を作る
        </ButtonLink>
      </div>

      {posts.length ? (
        <MyTradePostList posts={posts} />
      ) : (
        <EmptyState
          title="交換投稿はまだありません"
          text="出るボトルと求む条件をまとめて、最初の交換投稿を作りましょう。"
          href="/mypage/posts/new"
          label="交換投稿を作る"
        />
      )}
    </section>
  );
}

function InteractionsTab({
  sent,
  received,
}: {
  sent: Parameters<typeof InteractionsList>[0]["sent"];
  received: Parameters<typeof InteractionsList>[0]["received"];
}) {
  const total = sent.length + received.length;

  return (
    <section className="grid gap-4 pt-2">
      <div>
        <h2 className="text-xl font-semibold">やりとり</h2>
        <p className="mt-1 text-sm text-stone-600">
          興味あり・相談中・完了した取引をまとめて確認できます。
        </p>
      </div>

      {total > 0 ? (
        <InteractionsList sent={sent} received={received} />
      ) : (
        <EmptyState
          title="やりとりはまだありません"
          text="気になる交換投稿に興味ありを送ると、ここに表示されます。"
          href="/posts"
          label="交換投稿を探す"
        />
      )}
    </section>
  );
}

function AccountTab() {
  return (
    <section className="grid gap-3 pt-2">
      <h2 className="text-xl font-semibold">アカウント</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href="/settings/profile"
          className="flex items-center gap-3 rounded-md border border-stone-200 bg-white/82 p-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-white"
        >
          <Settings size={16} aria-hidden="true" />
          プロフィール設定
        </Link>
        <Link
          href="/settings/account/password"
          className="flex items-center gap-3 rounded-md border border-stone-200 bg-white/82 p-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-white"
        >
          <KeyRound size={16} aria-hidden="true" />
          パスワード変更
        </Link>
        <form action={logoutAction}>
          <button
            className="flex w-full items-center gap-3 rounded-md border border-stone-200 bg-white/82 p-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-white"
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
  );
}

/* ─── Shared components ─── */

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
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
