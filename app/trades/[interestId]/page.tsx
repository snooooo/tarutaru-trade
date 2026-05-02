import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { TradeDetailPanel } from "@/components/trades/trade-detail-panel";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getTradeInterestDetail } from "@/lib/data/interests";

type TradeDetailPageProps = {
  params: Promise<{ interestId: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
};

export default async function TradeDetailPage({
  params,
  searchParams,
}: TradeDetailPageProps) {
  const { interestId } = await params;
  const search = await searchParams;
  await requireCompleteTradeProfile(`/trades/${interestId}`);
  const trade = await getTradeInterestDetail(interestId);

  if (trade.isConfigured && !trade.data && !trade.error) {
    notFound();
  }

  return (
    <PageShell>
      <section className="grid gap-6">
        <DataStatusNote isConfigured={trade.isConfigured} error={trade.error} />

        {search.updated === "consulting" ? (
          <SuccessNote>トレード相談フェーズに進みました。</SuccessNote>
        ) : null}
        {search.updated === "canceled" ? (
          <SuccessNote>取引をキャンセルしました。</SuccessNote>
        ) : null}
        {search.updated === "completion_requested" ? (
          <SuccessNote>完了確認を送りました。相手の確認を待っています。</SuccessNote>
        ) : null}
        {search.updated === "completed" ? (
          <SuccessNote>双方の完了確認が揃い、取引が完了しました。</SuccessNote>
        ) : null}
        {search.updated === "reviewed" ? (
          <SuccessNote>評価を登録しました。</SuccessNote>
        ) : null}
        {search.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {search.error}
          </p>
        ) : null}

        {trade.data ? (
          <TradeDetailPanel trade={trade.data} />
        ) : (
          <p className="rounded-md border border-stone-200 bg-white/82 p-6 text-stone-700">
            取引詳細を表示できませんでした。
          </p>
        )}
      </section>
    </PageShell>
  );
}

function SuccessNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {children}
    </p>
  );
}
