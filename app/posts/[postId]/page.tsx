import { notFound } from "next/navigation";
import { CheckCircle2, Star, Truck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicTradePost } from "@/lib/data/trade-posts";
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
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;
  const result = await getPublicTradePost(postId);
  const post = result.data[0];

  if (result.isConfigured && !result.error && !post) {
    notFound();
  }

  return (
    <PageShell>
      <DataStatusNote isConfigured={result.isConfigured} error={result.error} />
      {post ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <p className="text-sm font-medium text-stone-500">
                {formatDate(post.published_at ?? post.created_at)}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {post.title || post.offer_items[0]?.display_bottle_name || "交換投稿"}
              </h1>
              {post.condition_note ? (
                <div className="mt-6 border-t border-stone-100 pt-5">
                  <h2 className="font-semibold">補足条件</h2>
                  <p className="mt-2 whitespace-pre-wrap text-stone-700">
                    {post.condition_note}
                  </p>
                </div>
              ) : null}
            </section>

            <section className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-stone-500">Outgoing</p>
                <h2 className="mt-1 text-2xl font-semibold">出る</h2>
              </div>
              <div className="grid gap-3">
                {post.offer_items.map((item) => (
                  <OfferDetail key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-stone-500">Wanted</p>
                <h2 className="mt-1 text-2xl font-semibold">求む</h2>
              </div>
              {post.want_items.length ? (
                <div className="grid gap-3">
                  {post.want_items.map((item) => (
                    <WantDetail key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-stone-200 bg-white/82 p-5">
                  <h3 className="font-semibold">提案歓迎</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    求むボトルは未指定です。条件に合いそうな候補で相談できます。
                  </p>
                </div>
              )}
            </section>
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="text-lg font-semibold">投稿者</h2>
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
                <span className="flex items-center gap-2">
                  <Truck size={16} aria-hidden="true" />
                  {post.owner_anonymous_shipping_ok
                    ? "匿名配送OK"
                    : "匿名配送未設定"}
                </span>
                <span>{formatFollowersRange(post.owner_x_followers_range)}</span>
              </div>
            </section>
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="font-semibold">トレードに興味あり</h2>
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
          </aside>
        </div>
      ) : null}
    </PageShell>
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
        <Info label="相場中央値" value={formatPrice(item.median_price)} />
        <Info label="箱状態" value={formatBoxCondition(item.box_condition)} />
        <Info label="ラベル" value={formatLabelCondition(item.label_condition)} />
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
      <div className="mt-5 max-w-xs">
        <Info label="相場中央値" value={formatPrice(item.median_price)} />
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
