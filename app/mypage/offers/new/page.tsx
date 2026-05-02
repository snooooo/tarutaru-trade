import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { OfferForm } from "@/components/offers/offer-form";
import { ButtonLink } from "@/components/ui/button-link";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";

type NewOfferPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewOfferPage({ searchParams }: NewOfferPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage/offers/new");

  return (
    <PageShell>
      <section className="mx-auto grid max-w-3xl gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">New offer</p>
          <h1 className="mt-1 text-3xl font-semibold">
            出せるボトルを登録
          </h1>
          <p className="mt-3 text-stone-700">
            MaltPeriのボトルを選ぶか、見つからない場合は手動名で登録できます。
            公開後は出品一覧に表示されます。
          </p>
        </div>

        {params.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {params.error}
          </p>
        ) : null}

        <OfferForm />

        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/offers" variant="secondary">
            出品一覧へ戻る
          </ButtonLink>
          <ButtonLink href="/mypage/wants/new" className="gap-2">
            欲しいボトル登録へ
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
