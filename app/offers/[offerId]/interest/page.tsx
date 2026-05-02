import { notFound } from "next/navigation";
import { BottleWine } from "lucide-react";
import { InterestCreateForm } from "@/components/interests/interest-create-form";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getMySelectableOfferItems } from "@/lib/data/interests";
import { getPublicOffer } from "@/lib/data/trade";
import {
  bottleSubline,
  formatBoxCondition,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";

type OfferInterestPageProps = {
  params: Promise<{ offerId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function OfferInterestPage({
  params,
  searchParams,
}: OfferInterestPageProps) {
  const { offerId } = await params;
  const query = await searchParams;
  await requireCompleteTradeProfile(`/offers/${offerId}/interest`);
  const [result, myOffers] = await Promise.all([
    getPublicOffer(offerId),
    getMySelectableOfferItems(),
  ]);
  const offer = result.data[0];

  if (result.isConfigured && !result.error && !offer) {
    notFound();
  }

  return (
    <PageShell>
      <section className="mx-auto grid max-w-3xl gap-6">
        <DataStatusNote isConfigured={result.isConfigured} error={result.error} />
        <DataStatusNote
          isConfigured={myOffers.isConfigured}
          error={myOffers.error}
        />
        <div>
          <p className="text-sm font-medium text-stone-500">Interest</p>
          <h1 className="mt-1 text-3xl font-semibold">興味ありを送る</h1>
          <p className="mt-3 text-stone-700">
            自分の出せるボトルを1本選んで、軽い興味ありを送ります。
            この段階では自由記述メッセージもX IDも相手に表示されません。
          </p>
        </div>

        {query.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {query.error}
          </p>
        ) : null}

        <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-stone-950 text-white">
              <BottleWine size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold">
                {offer?.display_bottle_name ?? "対象の出品"}
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                {offer ? bottleSubline(offer) : "MaltPeri情報なし"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-700">
                <span className="rounded bg-stone-100 px-2 py-1">
                  {formatBoxCondition(offer?.box_condition)}
                </span>
                <span className="rounded bg-stone-100 px-2 py-1">
                  ラベル {formatLabelCondition(offer?.label_condition)}
                </span>
                <span className="rounded bg-stone-100 px-2 py-1">
                  {formatPrice(offer?.median_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {offer ? (
          <InterestCreateForm
            offerItems={myOffers.data}
            returnPath={`/offers/${offerId}/interest`}
            targetId={offer.id}
            targetType="offer"
          />
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href={`/offers/${offerId}`} variant="secondary">
            詳細へ戻る
          </ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
