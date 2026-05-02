import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { OfferList } from "@/components/offers/offer-list";
import { ButtonLink } from "@/components/ui/button-link";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { WantList } from "@/components/wants/want-list";
import { getPublicOffers, getPublicWants } from "@/lib/data/trade";

export default async function Home() {
  const [offers, wants] = await Promise.all([
    getPublicOffers({ limit: 6 }),
    getPublicWants({ limit: 6 }),
  ]);

  return (
    <PageShell>
      <section className="grid gap-8 py-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-sm font-medium text-stone-700">
            <ShieldCheck size={16} aria-hidden="true" />
            powered by MaltPeri
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-6xl">
            TaruTaru Trade
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            ボトルだけ公開して、相談開始後にX IDを相互開示。MaltPeriのボトル・相場データを使いながら、気軽にウイスキー交換のきっかけを探せます。
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white/75 p-4 shadow-sm">
          <SearchForm
            action="/offers"
            placeholder="ボトル名・蒸留所・地域で検索"
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ButtonLink href="/offers" variant="secondary" className="gap-2">
              出品を見る
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/wants" variant="secondary" className="gap-2">
              募集を見る
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        <DataStatusNote
          isConfigured={offers.isConfigured && wants.isConfigured}
          error={offers.error ?? wants.error}
        />
      </div>

      <section className="mt-10 grid gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-500">New offers</p>
            <h2 className="text-2xl font-semibold">新着出品</h2>
          </div>
          <ButtonLink href="/offers" variant="ghost">
            すべて見る
          </ButtonLink>
        </div>
        <OfferList offers={offers.data} />
      </section>

      <section className="mt-12 grid gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-500">New wants</p>
            <h2 className="text-2xl font-semibold">新着募集</h2>
          </div>
          <ButtonLink href="/wants" variant="ghost">
            すべて見る
          </ButtonLink>
        </div>
        <WantList wants={wants.data} />
      </section>
    </PageShell>
  );
}
