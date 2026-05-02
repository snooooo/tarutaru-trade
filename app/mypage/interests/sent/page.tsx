import { InterestListCards } from "@/components/interests/interest-list-cards";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getSentInterests } from "@/lib/data/interests";

type SentInterestsPageProps = {
  searchParams: Promise<{ created?: string; updated?: string; error?: string }>;
};

export default async function SentInterestsPage({
  searchParams,
}: SentInterestsPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage/interests/sent");
  const interests = await getSentInterests();

  return (
    <PageShell>
      <section className="grid gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">Sent interests</p>
            <h1 className="mt-1 text-3xl font-semibold">送った興味あり</h1>
            <p className="mt-3 max-w-2xl text-stone-700">
              相手の確認待ち、相談開始済み、見送り済みの興味ありを確認できます。
              X IDは相談開始前には表示されません。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/mypage" variant="secondary">
              マイページ
            </ButtonLink>
            <ButtonLink href="/mypage/interests/received" variant="secondary">
              届いた興味あり
            </ButtonLink>
          </div>
        </div>

        <DataStatusNote
          isConfigured={interests.isConfigured}
          error={interests.error}
        />

        {params.created === "interest" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            興味ありを送りました。相手が相談開始を選ぶまでお待ちください。
          </p>
        ) : null}
        {params.updated === "canceled" ? (
          <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
            興味ありを取り下げました。
          </p>
        ) : null}
        {params.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {params.error}
          </p>
        ) : null}

        <InterestListCards direction="sent" interests={interests.data} />
      </section>
    </PageShell>
  );
}
