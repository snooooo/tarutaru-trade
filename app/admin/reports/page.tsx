import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";
import { resolveReportAction } from "@/lib/actions/report-actions";
import { formatDate } from "@/lib/format/trade";

type TradeReport = {
  id: string;
  trade_post_id: string;
  reporter_user_id: string;
  reason: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
};

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const admin = createAdminSupabaseClient();
  const reports: TradeReport[] = [];

  if (admin) {
    const { data } = await admin
      .from("trade_reports")
      .select("id, trade_post_id, reporter_user_id, reason, status, admin_note, created_at")
      .order("created_at", { ascending: false });
    if (data) reports.push(...(data as TradeReport[]));
  }

  const pending = reports.filter((r) => r.status === "pending");
  const resolved = reports.filter((r) => r.status === "resolved");

  return (
    <PageShell>
      <h1 className="text-2xl font-semibold">通報一覧</h1>
      <p className="mt-1 text-sm text-stone-500">
        未対応 {pending.length}件 / 対応済み {resolved.length}件
      </p>

      {pending.length > 0 && (
        <section className="mt-6 grid gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            未対応
          </h2>
          {pending.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </section>
      )}

      {resolved.length > 0 && (
        <section className="mt-8 grid gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
            対応済み
          </h2>
          {resolved.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </section>
      )}

      {reports.length === 0 && (
        <p className="mt-12 text-center text-stone-400">通報はまだありません。</p>
      )}
    </PageShell>
  );
}

function ReportCard({ report }: { report: TradeReport }) {
  const isResolved = report.status === "resolved";
  return (
    <div className={`rounded-md border p-4 text-sm ${isResolved ? "border-stone-200 bg-white/50 text-stone-500" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <a
            href={`/posts/${report.trade_post_id}`}
            className="font-semibold underline underline-offset-2 hover:text-stone-600"
          >
            投稿 {report.trade_post_id.slice(0, 8)}…
          </a>
          <p className="text-xs text-stone-500">
            {formatDate(report.created_at)} ／ 通報者 {report.reporter_user_id.slice(0, 8)}…
          </p>
          {report.reason && (
            <p className="mt-2 whitespace-pre-wrap leading-6">{report.reason}</p>
          )}
          {!report.reason && (
            <p className="mt-1 text-stone-400 italic">理由の記載なし</p>
          )}
        </div>
        {!isResolved && (
          <form action={resolveReportAction} className="shrink-0">
            <input type="hidden" name="report_id" value={report.id} />
            <button className="inline-flex h-8 items-center rounded-md border border-stone-300 bg-white px-3 text-xs font-medium text-stone-700 transition hover:bg-stone-50">
              対応済みにする
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
