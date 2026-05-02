import { InterestListCards } from "@/components/interests/interest-list-cards";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getReceivedInterests } from "@/lib/data/interests";

type ReceivedInterestsPageProps = {
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export default async function ReceivedInterestsPage({
  searchParams,
}: ReceivedInterestsPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage/interests/received");
  const interests = await getReceivedInterests();

  return (
    <PageShell>
      <section className="grid gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">
              Received interests
            </p>
            <h1 className="mt-1 text-3xl font-semibold">届いた興味あり</h1>
            <p className="mt-3 max-w-2xl text-stone-700">
              相手の候補ボトルを確認して、相談に進むか見送るかを選べます。
              興味あり段階では相手のX IDは表示されません。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/mypage" variant="secondary">
              マイページ
            </ButtonLink>
            <ButtonLink href="/mypage/interests/sent" variant="secondary">
              送った興味あり
            </ButtonLink>
          </div>
        </div>

        <DataStatusNote
          isConfigured={interests.isConfigured}
          error={interests.error}
        />

        {params.updated === "consulting" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            トレード相談フェーズに進みました。
          </p>
        ) : null}
        {params.updated === "dismissed" ? (
          <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
            興味ありを見送りました。
          </p>
        ) : null}
        {params.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {params.error}
          </p>
        ) : null}

        <InterestListCards direction="received" interests={interests.data} />
      </section>
    </PageShell>
  );
}
