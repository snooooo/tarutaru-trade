import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Star, Truck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicOffer } from "@/lib/data/trade";
import {
  bottleSubline,
  formatBoxCondition,
  formatDate,
  formatFollowersRange,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";

type OfferDetailPageProps = {
  params: Promise<{ offerId: string }>;
};

export default async function OfferDetailPage({
  params,
}: OfferDetailPageProps) {
  const { offerId } = await params;
  const result = await getPublicOffer(offerId);
  const offer = result.data[0];

  if (result.isConfigured && !result.error && !offer) {
    notFound();
  }

  return (
    <PageShell>
      <DataStatusNote isConfigured={result.isConfigured} error={result.error} />
      {offer ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100">
              {offer.image_url ? (
                <Image
                  src={offer.image_url}
                  alt={offer.display_bottle_name ?? "出品ボトル"}
                  fill
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-500">
                  Bottle image
                </div>
              )}
            </div>
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <p className="text-sm font-medium text-stone-500">
                {formatDate(offer.created_at)}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">
                {offer.display_bottle_name ?? "名称未設定のボトル"}
              </h1>
              <p className="mt-3 text-stone-700">{bottleSubline(offer)}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Info label="相場中央値" value={formatPrice(offer.median_price)} />
                <Info
                  label="箱状態"
                  value={formatBoxCondition(offer.box_condition)}
                />
                <Info
                  label="ラベル"
                  value={formatLabelCondition(offer.label_condition)}
                />
              </div>
              <div className="mt-6 border-t border-stone-100 pt-5">
                <h2 className="font-semibold">備考</h2>
                <p className="mt-2 whitespace-pre-wrap text-stone-700">
                  {offer.note || "備考の記載はありません。"}
                </p>
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="text-lg font-semibold">登録者</h2>
              <p className="mt-2 text-xl font-semibold">
                {offer.owner_display_name ?? "ななしさん"}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-stone-700">
                <span className="flex items-center gap-2">
                  <Star size={16} aria-hidden="true" />
                  評価 {offer.owner_average_rating?.toFixed(1) ?? "-"} /{" "}
                  {offer.owner_review_count ?? 0}件
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  完了 {offer.owner_completed_count ?? 0}件
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={16} aria-hidden="true" />
                  {offer.owner_anonymous_shipping_ok ? "匿名配送OK" : "匿名配送未設定"}
                </span>
                <span>{formatFollowersRange(offer.owner_x_followers_range)}</span>
              </div>
            </section>
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="font-semibold">トレードに興味あり</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                MVPではログイン、X ID登録、交換候補ボトル選択を確認してから興味あり送信へ進みます。
              </p>
              <ButtonLink
                href={`/offers/${offer.id}/interest`}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-stone-50 p-3">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
