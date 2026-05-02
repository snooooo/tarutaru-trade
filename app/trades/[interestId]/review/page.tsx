import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ReviewForm } from "@/components/trades/review-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getTradeInterestDetail } from "@/lib/data/interests";

type ReviewPageProps = {
  params: Promise<{ interestId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  const { interestId } = await params;
  const search = await searchParams;
  await requireCompleteTradeProfile(`/trades/${interestId}/review`);
  const trade = await getTradeInterestDetail(interestId);

  if (trade.data?.status !== "completed") {
    redirect(`/trades/${interestId}`);
  }

  if (trade.data.has_reviewed) {
    redirect(`/trades/${interestId}?updated=reviewed`);
  }

  return (
    <PageShell>
      <section className="grid gap-6">
        <DataStatusNote isConfigured={trade.isConfigured} error={trade.error} />
        {search.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {search.error}
          </p>
        ) : null}
        <ReviewForm trade={trade.data} />
      </section>
    </PageShell>
  );
}
