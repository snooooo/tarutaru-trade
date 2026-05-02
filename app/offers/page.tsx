import { PageShell } from "@/components/layout/page-shell";
import { OfferList } from "@/components/offers/offer-list";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicOffers } from "@/lib/data/trade";

type OffersPageProps = {
  searchParams: Promise<{ q?: string; created?: string }>;
};

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const offers = await getPublicOffers({ query });

  return (
    <PageShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">Offers</p>
          <h1 className="mt-1 text-3xl font-semibold">出品を探す</h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            交換に出せるボトルの公開一覧です。X IDは相談開始まで表示されません。
          </p>
        </div>
        <SearchForm
          action="/offers"
          placeholder="ボトル名・蒸留所・地域で検索"
          defaultValue={query}
        />
        <DataStatusNote isConfigured={offers.isConfigured} error={offers.error} />
        {params.created === "offer" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            出品を公開しました。一覧に反映されています。
          </p>
        ) : null}
        <OfferList offers={offers.data} />
      </div>
    </PageShell>
  );
}
