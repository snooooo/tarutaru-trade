import { notFound } from "next/navigation";
import {
  CheckCircle2,
  MapPin,
  Pencil,
  PauseCircle,
  Star,
  Truck,
} from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { updateTradePostVisibilityAction } from "@/lib/actions/trade-post-actions";
import { getMyTradePost, getPublicTradePost } from "@/lib/data/trade-posts";
import { getCurrentUser } from "@/lib/auth/require-user";
import { LikeButton } from "@/components/posts/like-button";
import { ReportButton } from "@/components/posts/report-button";
import { YahooAuctionLink } from "@/components/ui/yahoo-auction-link";
import { getLikeStatusForPost } from "@/lib/data/likes";
import {
  bottleSubline,
  formatBoxCondition,
  formatDate,
  formatFollowersRange,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";
import type {
  PublicTradePostOfferItem,
  PublicTradePostWantItem,
} from "@/lib/types/trade-posts";

type PostDetailPageProps = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export default async function PostDetailPage({
  params,
  searchParams,
}: PostDetailPageProps) {
  const { postId } = await params;
  const query = await searchParams;
  const [result, myPostResult, currentUser, likeStatus] = await Promise.all([
    getPublicTradePost(postId),
    getMyTradePost(postId),
    getCurrentUser(),
    getLikeStatusForPost(postId),
  ]);
  const post = result.data[0];
  const myPost = myPostResult.data[0];
  const isMyPost = Boolean(myPost);
  const isClosed = post?.status === "closed";
  const showLike = post && !isMyPost && (!isClosed || likeStatus.liked);
  const loginHref = `/login?next=${encodeURIComponent(`/posts/${postId}`)}`;
  if (result.isConfigured && !result.error && !post) {
    notFound();
  }

  return (
    <PageShell>
      <BackButton fallbackHref="/posts" />
      <DataStatusNote isConfigured={result.isConfigured} error={result.error} />
      <DataStatusNote
        isConfigured={myPostResult.isConfigured}
        error={myPostResult.error}
      />
      <PostUpdateMessage updated={query.updated} error={query.error} />
      {post ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-stone-500">
                  {formatDate(post.published_at ?? post.created_at)}
                </p>
                {isClosed ? (
                  <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
                    {formatDate(post.closed_at ?? post.published_at ?? post.created_at)}に取引終了
                  </span>
                ) : null}
              </div>
              {showLike ? (
                <LikeButton
                  postId={post.id}
                  initialLiked={likeStatus.liked}
                  initialCount={likeStatus.count}
                  loginHref={loginHref}
                  disabled={isClosed && !likeStatus.liked}
                />
              ) : null}
            </header>

            <section className="grid gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400">出</h2>
              <div className="grid gap-3">
                {post.offer_items.map((item) => (
                  <OfferDetail key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="grid gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400">求</h2>
              {post.want_items.length ? (
                <div className="grid gap-3">
                  {post.want_items.map((item) => (
                    <WantDetail key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-stone-200 bg-white/82 p-5">
                  <p className="font-semibold">提案歓迎</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    求のボトルは未指定です。条件に合いそうな候補で相談できます。
                  </p>
                </div>
              )}
            </section>

            {!isClosed && post.condition_note ? (
              <section className="grid gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">補足</h2>
                <div className="rounded-md border border-stone-200 bg-white/82 p-5">
                  <p className="text-xs text-stone-500">出・求両方にかかる条件や補足です</p>
                  <p className="mt-3 whitespace-pre-wrap text-stone-700">
                    {post.condition_note}
                  </p>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="grid content-start gap-4">
            {isClosed ? null : (
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">投稿者</h2>
              <p className="mt-2 text-xl font-semibold">
                {post.owner_display_name ?? "ななしさん"}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-stone-700">
                <span className="flex items-center gap-2">
                  <Star size={16} aria-hidden="true" />
                  評価 {post.owner_average_rating?.toFixed(1) ?? "-"} /{" "}
                  {post.owner_review_count ?? 0}件
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  完了 {post.owner_completed_count ?? 0}件
                </span>
                {post.owner_shipping_region ? (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} aria-hidden="true" />
                    {post.owner_shipping_region}から発送
                  </span>
                ) : null}
                <span className="flex items-center gap-2">
                  <Truck size={16} aria-hidden="true" />
                  {post.owner_shipping_preference === "anonymous_only"
                    ? "配送先住所等を知らせたくない"
                    : post.owner_shipping_preference === "disclose_preferred"
                      ? "住所等を開示して取引したい"
                      : "配送方法は相談して決めたい"}
                </span>
                <span>{formatFollowersRange(post.owner_x_followers_range)}</span>
              </div>
            </section>
            )}
            {isMyPost ? (
              <OwnerPostActions postId={post.id} />
            ) : isClosed ? null : (
              <>
                <section className="rounded-md border border-stone-200 bg-white/82 p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">トレードに興味あり</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    興味あり時点ではX IDと自由記述メッセージは送信されません。相談開始後にX IDを相互開示します。
                  </p>
                  <ButtonLink
                    href={`/posts/${post.id}/interest`}
                    className="mt-4 w-full"
                  >
                    興味ありへ進む
                  </ButtonLink>
                </section>
                <section className="rounded-md border border-stone-200 bg-white/82 p-4">
                  <ReportButton
                    postId={post.id}
                    loginHref={`/login?next=${encodeURIComponent(`/posts/${post.id}`)}`}
                    isLoggedIn={Boolean(currentUser)}
                  />
                </section>
              </>
            )}
          </aside>
        </div>
      ) : null}
    </PageShell>
  );
}

function OwnerPostActions({ postId }: { postId: string }) {
  return (
    <section className="rounded-md border border-stone-200 bg-white/82 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">自分のトレード投稿</h2>
      <p className="mt-2 text-sm leading-6 text-stone-700">
        公開中の内容を確認しながら、編集や受付停止ができます。
      </p>
      <div className="mt-4 grid gap-2">
        <ButtonLink
          href={`/mypage/posts/${postId}/edit`}
          variant="secondary"
          className="w-full gap-2"
        >
          <Pencil size={16} aria-hidden="true" />
          編集する
        </ButtonLink>
        <form action={updateTradePostVisibilityAction}>
          <input type="hidden" name="trade_post_id" value={postId} />
          <input type="hidden" name="next_status" value="private" />
          <input type="hidden" name="redirect_to" value="/mypage" />
          <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-4 text-sm font-semibold text-stone-950 transition hover:bg-white">
            <PauseCircle size={16} aria-hidden="true" />
            受付停止にする
          </button>
        </form>
      </div>
    </section>
  );
}

function PostUpdateMessage({
  updated,
  error,
}: {
  updated?: string;
  error?: string;
}) {
  const messages: Record<string, string> = {
    post_private: "トレード投稿の受付を停止しました。",
    post_public: "トレード投稿を再公開しました。",
  };

  if (!updated && !error) {
    return null;
  }

  return (
    <div
      className={`mt-4 rounded-md border px-4 py-3 text-sm font-medium ${
        error
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {error ?? messages[updated ?? ""] ?? "トレード投稿を更新しました。"}
    </div>
  );
}

function OfferDetail({ item }: { item: PublicTradePostOfferItem }) {
  return (
    <article className="rounded-md border border-stone-200 bg-white/82 p-5">
      <h3 className="text-xl font-semibold">
        {item.display_bottle_name ?? "名称未設定のボトル"}
      </h3>
      <p className="mt-2 text-stone-700">{bottleSubline(item)}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {item.median_price != null ? (
          <Info label="相場中央値" value={formatPrice(item.median_price)} />
        ) : null}
        <Info label="箱状態" value={formatBoxCondition(item.box_condition)} />
        <Info label="ラベル" value={formatLabelCondition(item.label_condition)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <YahooAuctionLink bottleName={item.display_bottle_name} />
      </div>
      {item.note ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {item.note}
        </p>
      ) : null}
    </article>
  );
}

function WantDetail({ item }: { item: PublicTradePostWantItem }) {
  return (
    <article className="rounded-md border border-stone-200 bg-white/82 p-5">
      <h3 className="text-xl font-semibold">
        {item.display_bottle_name ?? "名称未設定のボトル"}
      </h3>
      <p className="mt-2 text-stone-700">{bottleSubline(item)}</p>
      {item.median_price != null ? (
        <div className="mt-5 max-w-xs">
          <Info label="相場中央値" value={formatPrice(item.median_price)} />
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <YahooAuctionLink bottleName={item.display_bottle_name} />
      </div>
      {item.condition_note ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">
          {item.condition_note}
        </p>
      ) : null}
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-stone-50 p-3">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
