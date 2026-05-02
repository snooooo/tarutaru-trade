import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { WantForm } from "@/components/wants/want-form";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";

type NewWantPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewWantPage({ searchParams }: NewWantPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage/wants/new");

  return (
    <PageShell>
      <section className="mx-auto grid max-w-3xl gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">New want</p>
          <h1 className="mt-1 text-3xl font-semibold">
            欲しいボトルを登録
          </h1>
          <p className="mt-3 text-stone-700">
            MaltPeriのボトルを選ぶか、見つからない場合は手動名で募集できます。
            公開後は募集一覧に表示されます。
          </p>
        </div>

        {params.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {params.error}
          </p>
        ) : null}

        <WantForm />

        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/wants" variant="secondary">
            募集一覧へ戻る
          </ButtonLink>
          <ButtonLink href="/mypage/offers/new" className="gap-2">
            出せるボトル登録へ
            <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
