import { notFound } from "next/navigation";
import { ListPlus } from "lucide-react";
import { InterestCreateForm } from "@/components/interests/interest-create-form";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getMySelectableOfferItems } from "@/lib/data/interests";
import { getPublicWant } from "@/lib/data/trade";
import { bottleSubline, formatPrice } from "@/lib/format/trade";

type WantInterestPageProps = {
  params: Promise<{ wantId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function WantInterestPage({
  params,
  searchParams,
}: WantInterestPageProps) {
  const { wantId } = await params;
  const query = await searchParams;
  await requireCompleteTradeProfile(`/wants/${wantId}/interest`);
  const [result, myOffers] = await Promise.all([
    getPublicWant(wantId),
    getMySelectableOfferItems(),
  ]);
  const want = result.data[0];

  if (result.isConfigured && !result.error && !want) {
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
            この募集に対して、自分が交換候補として出せるボトルを選びます。
            興味あり時点ではX IDは表示されません。
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
              <ListPlus size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold">
                {want?.display_bottle_name ?? "対象の募集"}
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                {want ? bottleSubline(want) : "MaltPeri情報なし"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-700">
                <span className="rounded bg-stone-100 px-2 py-1">
                  {formatPrice(want?.median_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {want ? (
          <InterestCreateForm
            offerItems={myOffers.data}
            returnPath={`/wants/${wantId}/interest`}
            targetId={want.id}
            targetType="want"
          />
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href={`/wants/${wantId}`} variant="secondary">
            詳細へ戻る
          </ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
