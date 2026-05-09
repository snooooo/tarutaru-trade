import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AlertTriangle, Eye, EyeOff, Flag } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";

type CountQuery = {
  select: (
    columns: string,
    options: { count: "exact"; head: true },
  ) => CountFilter;
};

type CountFilter = {
  eq: (
    column: string,
    value: string,
  ) => Promise<{ count: number | null; error: { message: string } | null }>;
  not: (
    column: string,
    operator: "is",
    value: null,
  ) => Promise<{ count: number | null; error: { message: string } | null }>;
};

type CountSupabase = {
  from: (table: string) => CountQuery;
};

async function countRows(
  admin: CountSupabase,
  table: string,
  filter: (query: CountFilter) => Promise<{
    count: number | null;
    error: { message: string } | null;
  }>,
) {
  const result = await filter(admin.from(table).select("id", { count: "exact", head: true }));
  return {
    count: result.count ?? 0,
    error: result.error?.message ?? null,
  };
}

export default async function AdminPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return (
      <PageShell>
        <h1 className="text-2xl font-semibold">管理者ダッシュボード</h1>
        <AdminWarning message="管理者用Supabase環境変数が未設定です。" />
      </PageShell>
    );
  }

  const loose = admin as unknown as CountSupabase;
  const [pendingReports, publicPosts, privatePosts, adminHiddenPosts] =
    await Promise.all([
      countRows(loose, "trade_reports", (query) => query.eq("status", "pending")),
      countRows(loose, "trade_posts", (query) => query.eq("status", "public")),
      countRows(loose, "trade_posts", (query) => query.eq("status", "private")),
      countRows(loose, "trade_posts", (query) =>
        query.not("admin_hidden_at", "is", null),
      ),
    ]);
  const error = [
    pendingReports.error,
    publicPosts.error,
    privatePosts.error,
    adminHiddenPosts.error,
  ].find(Boolean);

  return (
    <PageShell>
      <div>
        <p className="text-sm font-medium text-stone-500">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold">管理者ダッシュボード</h1>
      </div>

      {error ? <AdminWarning message={error} /> : null}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          href="/admin/reports"
          label="未対応の通報"
          value={pendingReports.count}
          tone={pendingReports.count > 0 ? "alert" : "default"}
          icon={<Flag size={18} aria-hidden="true" />}
        />
        <DashboardCard
          href="/admin/posts?status=public"
          label="公開中の投稿"
          value={publicPosts.count}
          icon={<Eye size={18} aria-hidden="true" />}
        />
        <DashboardCard
          href="/admin/posts?status=private"
          label="非公開の投稿"
          value={privatePosts.count}
          icon={<EyeOff size={18} aria-hidden="true" />}
        />
        <DashboardCard
          href="/admin/posts?admin_hidden=1"
          label="管理者非公開"
          value={adminHiddenPosts.count}
          tone={adminHiddenPosts.count > 0 ? "alert" : "default"}
          icon={<AlertTriangle size={18} aria-hidden="true" />}
        />
      </section>
    </PageShell>
  );
}

function AdminWarning({ message }: { message: string }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

function DashboardCard({
  href,
  label,
  value,
  icon,
  tone = "default",
}: {
  href: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "default" | "alert";
}) {
  return (
    <Link
      href={href}
      className={`rounded-md border p-5 transition hover:bg-white ${
        tone === "alert"
          ? "border-amber-200 bg-amber-50"
          : "border-stone-200 bg-white/82"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-sm font-medium text-stone-500">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums text-stone-950">
        {value}
      </p>
    </Link>
  );
}
