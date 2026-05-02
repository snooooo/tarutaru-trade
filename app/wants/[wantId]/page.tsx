import { notFound } from "next/navigation";
import { CheckCircle2, Star, Truck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicWant } from "@/lib/data/trade";
import {
  bottleSubline,
  formatDate,
  formatFollowersRange,
  formatPrice,
} from "@/lib/format/trade";

type WantDetailPageProps = {
  params: Promise<{ wantId: string }>;
};

export default async function WantDetailPage({ params }: WantDetailPageProps) {
  const { wantId } = await params;
  const result = await getPublicWant(wantId);
  const want = result.data[0];

  if (result.isConfigured && !result.error && !want) {
    notFound();
  }

  return (
    <PageShell>
      <DataStatusNote isConfigured={result.isConfigured} error={result.error} />
      {want ? (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-md border border-stone-200 bg-white/82 p-5">
            <p className="text-sm font-medium text-stone-500">
              {formatDate(want.created_at)}
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              {want.display_bottle_name ?? "名称未設定のボトル"}
            </h1>
            <p className="mt-3 text-stone-700">{bottleSubline(want)}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info label="相場中央値" value={formatPrice(want.median_price)} />
              <Info
                label="相場サンプル"
                value={
                  want.price_sample_count
                    ? `${want.price_sample_count}件`
                    : "データなし"
                }
              />
            </div>
            <div className="mt-6 border-t border-stone-100 pt-5">
              <h2 className="font-semibold">希望条件</h2>
              <p className="mt-2 whitespace-pre-wrap text-stone-700">
                {want.condition_note || "希望条件の記載はありません。"}
              </p>
            </div>
          </section>

          <aside className="grid content-start gap-4">
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="text-lg font-semibold">募集者</h2>
              <p className="mt-2 text-xl font-semibold">
                {want.owner_display_name ?? "ななしさん"}
              </p>
              <div className="mt-4 grid gap-3 text-sm text-stone-700">
                <span className="flex items-center gap-2">
                  <Star size={16} aria-hidden="true" />
                  評価 {want.owner_average_rating?.toFixed(1) ?? "-"} /{" "}
                  {want.owner_review_count ?? 0}件
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  完了 {want.owner_completed_count ?? 0}件
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={16} aria-hidden="true" />
                  {want.owner_anonymous_shipping_ok ? "匿名配送OK" : "匿名配送未設定"}
                </span>
                <span>{formatFollowersRange(want.owner_x_followers_range)}</span>
              </div>
            </section>
            <section className="rounded-md border border-stone-200 bg-white/82 p-5">
              <h2 className="font-semibold">トレードに興味あり</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                この募集に出せるボトルを選んで、軽い興味ありを送る導線です。
              </p>
              <ButtonLink
                href={`/wants/${want.id}/interest`}
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
