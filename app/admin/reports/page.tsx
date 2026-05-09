import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AlertTriangle, EyeOff } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";
import {
  resolveAndHidePostAction,
  resolveReportAction,
} from "@/lib/actions/report-actions";
import { formatDate } from "@/lib/format/trade";
import type { TradePostStatus } from "@/lib/types/trade-posts";

type AdminReportsPageProps = {
  searchParams: Promise<{ updated?: string; error?: string }>;
};

type TradeReport = {
  id: string;
  trade_post_id: string;
  reporter_user_id: string;
  reason: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
};

type ReportPost = {
  id: string;
  status: TradePostStatus;
  title: string | null;
  admin_hidden_at: string | null;
  admin_hidden_reason: string | null;
};

type AdminReportSupabase = {
  from: (table: string) => {
    select: (columns: string) => {
      order: (
        column: string,
        options?: { ascending?: boolean },
      ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
      in: (
        column: string,
        values: string[],
      ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
    };
  };
};

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  await connection();
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const params = await searchParams;
  const admin = createAdminSupabaseClient();
  const reports: TradeReport[] = [];
  let error = params.error ?? null;
  const posts = new Map<string, ReportPost>();

  if (admin) {
    const loose = admin as unknown as AdminReportSupabase;
    const { data, error: reportError } = await loose
      .from("trade_reports")
      .select("id, trade_post_id, reporter_user_id, reason, status, admin_note, created_at")
      .order("created_at", { ascending: false });
    if (data) reports.push(...(data as TradeReport[]));
    error = error ?? reportError?.message ?? null;

    const postIds = Array.from(new Set(reports.map((report) => report.trade_post_id)));
    if (postIds.length) {
      const postResult = await loose
        .from("trade_posts")
        .select("id,status,title,admin_hidden_at,admin_hidden_reason")
        .in("id", postIds);
      for (const post of (postResult.data ?? []) as ReportPost[]) {
        posts.set(post.id, post);
      }
      error = error ?? postResult.error?.message ?? null;
    }
  } else {
    error = error ?? "管理者用Supabase環境変数が未設定です。";
  }

  const pending = reports.filter((r) => r.status === "pending");
  const resolved = reports.filter((r) => r.status === "resolved");

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold">通報一覧</h1>
          <p className="mt-2 text-sm text-stone-500">
            未対応 {pending.length}件 / 対応済み {resolved.length}件
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
        >
          ダッシュボードへ
        </Link>
      </div>

      {params.updated === "resolved" ? (
        <AdminNotice tone="success" message="通報を対応済みにしました。" />
      ) : null}
      {params.updated === "hidden_and_resolved" ? (
        <AdminNotice tone="success" message="投稿を管理者非公開にして、通報を対応済みにしました。" />
      ) : null}
      {error ? <AdminNotice tone="error" message={error} /> : null}

      {pending.length > 0 && (
        <section className="mt-6 grid gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            未対応
          </h2>
          {pending.map((r) => (
            <ReportCard key={r.id} report={r} post={posts.get(r.trade_post_id)} />
          ))}
        </section>
      )}

      {resolved.length > 0 && (
        <section className="mt-8 grid gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
            対応済み
          </h2>
          {resolved.map((r) => (
            <ReportCard key={r.id} report={r} post={posts.get(r.trade_post_id)} />
          ))}
        </section>
      )}

      {reports.length === 0 && (
        <p className="mt-12 text-center text-stone-400">通報はまだありません。</p>
      )}
    </PageShell>
  );
}

function AdminNotice({
  tone,
  message,
}: {
  tone: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`mt-5 flex items-start gap-3 rounded-md border px-4 py-3 text-sm font-medium ${
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {tone === "error" ? (
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      ) : null}
      <p>{message}</p>
    </div>
  );
}

function ReportCard({
  report,
  post,
}: {
  report: TradeReport;
  post?: ReportPost;
}) {
  const isResolved = report.status === "resolved";
  const canHidePost =
    !isResolved &&
    (post?.status === "public" || post?.status === "closed") &&
    !post.admin_hidden_at;
  return (
    <div className={`rounded-md border p-4 text-sm ${isResolved ? "border-stone-200 bg-white/50 text-stone-500" : "border-amber-200 bg-amber-50"}`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-1">
          <Link
            href={`/posts/${report.trade_post_id}`}
            className="font-semibold underline underline-offset-2 hover:text-stone-600"
          >
            {post?.title ?? `投稿 ${report.trade_post_id.slice(0, 8)}...`}
          </Link>
          <p className="text-xs text-stone-500">
            {formatDate(report.created_at)} ／ 通報者 {report.reporter_user_id.slice(0, 8)}…
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {post ? <PostStatusBadge post={post} /> : null}
            {post?.admin_hidden_at ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                <EyeOff size={12} aria-hidden="true" />
                管理者非公開
              </span>
            ) : null}
          </div>
          {report.reason && (
            <p className="mt-2 whitespace-pre-wrap leading-6">{report.reason}</p>
          )}
          {!report.reason && (
            <p className="mt-1 text-stone-400 italic">理由の記載なし</p>
          )}
          {report.admin_note ? (
            <p className="mt-2 rounded-md bg-white/70 px-3 py-2 text-xs text-stone-600">
              管理メモ: {report.admin_note}
            </p>
          ) : null}
        </div>
        {!isResolved && (
          <div className="grid content-start gap-2">
            {canHidePost ? (
              <form action={resolveAndHidePostAction} className="grid gap-2">
                <input type="hidden" name="report_id" value={report.id} />
                <input
                  type="hidden"
                  name="trade_post_id"
                  value={report.trade_post_id}
                />
                <textarea
                  name="admin_hidden_reason"
                  rows={3}
                  placeholder="非公開理由・管理メモ"
                  className="min-h-20 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-500"
                />
                <button className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">
                  投稿を管理者非公開にして対応済み
                </button>
              </form>
            ) : null}
            <form action={resolveReportAction}>
              <input type="hidden" name="report_id" value={report.id} />
              <button className="inline-flex h-10 w-full items-center justify-center rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
                対応済みにする
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function PostStatusBadge({ post }: { post: ReportPost }) {
  const labels: Record<TradePostStatus, string> = {
    public: "公開中",
    private: "非公開",
    consulting: "相談中",
    closed: "終了",
  };
  return (
    <span className="rounded-md border border-stone-200 bg-white/70 px-2 py-0.5 text-xs font-semibold text-stone-700">
      {labels[post.status]}
    </span>
  );
}
