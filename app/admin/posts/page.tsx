import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { EyeOff, Search } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { adminHidePostAction } from "@/lib/actions/admin-post-actions";
import { getCurrentUser } from "@/lib/auth/require-user";
import { formatDate } from "@/lib/format/trade";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";
import type { TradePostStatus } from "@/lib/types/trade-posts";

type AdminPostsPageProps = {
  searchParams: Promise<{
    status?: string;
    admin_hidden?: string;
    q?: string;
    updated?: string;
    error?: string;
  }>;
};

type AdminPostRow = {
  id: string;
  user_id: string;
  title: string | null;
  status: TradePostStatus;
  created_at: string;
  admin_hidden_at: string | null;
  admin_hidden_by: string | null;
  admin_hidden_reason: string | null;
};

type AdminProfileRow = {
  user_id: string;
  display_name: string;
};

type AdminItemRow = {
  trade_post_id: string | null;
  manual_bottle_name: string | null;
  sort_order: number | null;
};

type AdminReportRow = {
  trade_post_id: string;
  status: string;
};

type AdminListSupabase = {
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

const statusFilters: { key: "all" | TradePostStatus; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "public", label: "公開中" },
  { key: "private", label: "非公開" },
  { key: "consulting", label: "相談中" },
  { key: "closed", label: "終了" },
];

function normalizeStatus(value?: string): "all" | TradePostStatus {
  return value === "public" ||
    value === "private" ||
    value === "consulting" ||
    value === "closed"
    ? value
    : "all";
}

function shortId(id: string) {
  return `${id.slice(0, 8)}...`;
}

function representativeItem(items: AdminItemRow[], postId: string) {
  const names = items
    .filter((item) => item.trade_post_id === postId)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => item.manual_bottle_name)
    .filter((name): name is string => Boolean(name));
  if (!names.length) return "-";
  return names.length > 1 ? `${names[0]} ほか${names.length - 1}件` : names[0];
}

export default async function AdminPostsPage({
  searchParams,
}: AdminPostsPageProps) {
  await connection();
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const params = await searchParams;
  const activeStatus = normalizeStatus(params.status);
  const adminHiddenOnly = params.admin_hidden === "1";
  const query = params.q?.trim().toLowerCase() ?? "";

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return (
      <PageShell>
        <h1 className="text-2xl font-semibold">投稿管理</h1>
        <AdminNotice tone="error" message="管理者用Supabase環境変数が未設定です。" />
      </PageShell>
    );
  }

  const loose = admin as unknown as AdminListSupabase;
  const postResult = await loose
    .from("trade_posts")
    .select(
      "id,user_id,title,status,created_at,admin_hidden_at,admin_hidden_by,admin_hidden_reason",
    )
    .order("created_at", { ascending: false });
  const posts = (postResult.data ?? []) as AdminPostRow[];
  const postIds = posts.map((post) => post.id);
  const userIds = Array.from(new Set(posts.map((post) => post.user_id)));

  const [profileResult, offerResult, wantResult, reportResult] =
    await Promise.all([
      userIds.length
        ? loose
            .from("trade_profiles")
            .select("user_id,display_name")
            .in("user_id", userIds)
        : Promise.resolve({ data: [], error: null }),
      postIds.length
        ? loose
            .from("trade_offer_items")
            .select("trade_post_id,manual_bottle_name,sort_order")
            .in("trade_post_id", postIds)
        : Promise.resolve({ data: [], error: null }),
      postIds.length
        ? loose
            .from("trade_want_items")
            .select("trade_post_id,manual_bottle_name,sort_order")
            .in("trade_post_id", postIds)
        : Promise.resolve({ data: [], error: null }),
      postIds.length
        ? loose
            .from("trade_reports")
            .select("trade_post_id,status")
            .in("trade_post_id", postIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  const profiles = new Map(
    ((profileResult.data ?? []) as AdminProfileRow[]).map((profile) => [
      profile.user_id,
      profile.display_name,
    ]),
  );
  const offers = (offerResult.data ?? []) as AdminItemRow[];
  const wants = (wantResult.data ?? []) as AdminItemRow[];
  const reports = (reportResult.data ?? []) as AdminReportRow[];
  const reportCounts = reports.reduce<Record<string, number>>((acc, report) => {
    acc[report.trade_post_id] = (acc[report.trade_post_id] ?? 0) + 1;
    return acc;
  }, {});
  const pendingReportCounts = reports.reduce<Record<string, number>>(
    (acc, report) => {
      if (report.status === "pending") {
        acc[report.trade_post_id] = (acc[report.trade_post_id] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  const error =
    params.error ??
    postResult.error?.message ??
    profileResult.error?.message ??
    offerResult.error?.message ??
    wantResult.error?.message ??
    reportResult.error?.message ??
    null;

  const filtered = posts.filter((post) => {
    if (activeStatus !== "all" && post.status !== activeStatus) return false;
    if (adminHiddenOnly && !post.admin_hidden_at) return false;
    if (!query) return true;
    const haystack = [
      post.id,
      post.user_id,
      post.title,
      profiles.get(post.user_id),
      representativeItem(offers, post.id),
      representativeItem(wants, post.id),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold">投稿管理</h1>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
        >
          ダッシュボードへ
        </Link>
      </div>

      {params.updated === "admin_hidden" ? (
        <AdminNotice tone="success" message="投稿を管理者非公開にしました。" />
      ) : null}
      {error ? <AdminNotice tone="error" message={error} /> : null}

      <form className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="投稿ID、ユーザーID、タイトル、ボトル名で検索"
            className="h-11 w-full rounded-md border border-stone-300 bg-white/80 pl-9 pr-3 text-sm outline-none transition focus:border-stone-500"
          />
        </div>
        {activeStatus !== "all" ? (
          <input type="hidden" name="status" value={activeStatus} />
        ) : null}
        {adminHiddenOnly ? (
          <input type="hidden" name="admin_hidden" value="1" />
        ) : null}
        <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          検索
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <FilterLink
            key={filter.key}
            active={activeStatus === filter.key && !adminHiddenOnly}
            href={`/admin/posts${filter.key === "all" ? "" : `?status=${filter.key}`}`}
          >
            {filter.label}
          </FilterLink>
        ))}
        <FilterLink active={adminHiddenOnly} href="/admin/posts?admin_hidden=1">
          管理者非公開
        </FilterLink>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        表示 {filtered.length}件 / 全 {posts.length}件
      </p>

      <section className="mt-4 grid gap-3">
        {filtered.map((post) => (
          <PostAdminRow
            key={post.id}
            post={post}
            ownerName={profiles.get(post.user_id)}
            offerLabel={representativeItem(offers, post.id)}
            wantLabel={representativeItem(wants, post.id)}
            reportCount={reportCounts[post.id] ?? 0}
            pendingReportCount={pendingReportCounts[post.id] ?? 0}
          />
        ))}
      </section>

      {!filtered.length ? (
        <p className="mt-10 rounded-md border border-dashed border-stone-300 bg-white/62 px-4 py-8 text-center text-sm text-stone-500">
          条件に合う投稿はありません。
        </p>
      ) : null}
    </PageShell>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center rounded-md px-3 text-sm font-semibold transition ${
        active
          ? "bg-stone-950 text-white"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
      }`}
    >
      {children}
    </Link>
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
      className={`mt-5 rounded-md border px-4 py-3 text-sm font-medium ${
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {message}
    </div>
  );
}

function PostAdminRow({
  post,
  ownerName,
  offerLabel,
  wantLabel,
  reportCount,
  pendingReportCount,
}: {
  post: AdminPostRow;
  ownerName?: string;
  offerLabel: string;
  wantLabel: string;
  reportCount: number;
  pendingReportCount: number;
}) {
  const canAdminHide = post.status === "public" && !post.admin_hidden_at;

  return (
    <article className="rounded-md border border-stone-200 bg-white/82 p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={post.status} />
            {post.admin_hidden_at ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                <EyeOff size={12} aria-hidden="true" />
                管理者非公開
              </span>
            ) : null}
            {pendingReportCount > 0 ? (
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                未対応通報 {pendingReportCount}件
              </span>
            ) : reportCount > 0 ? (
              <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-600">
                通報 {reportCount}件
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 truncate text-base font-semibold">
            {post.title || offerLabel}
          </h2>
          <div className="mt-2 grid gap-1 text-sm text-stone-600">
            <p>
              出 {offerLabel} / 求 {wantLabel}
            </p>
            <p>
              投稿 {shortId(post.id)} / ユーザー {ownerName ?? shortId(post.user_id)}
            </p>
            <p>作成 {formatDate(post.created_at)}</p>
            {post.admin_hidden_at ? (
              <p className="text-red-700">
                非公開 {formatDate(post.admin_hidden_at)}
                {post.admin_hidden_reason ? ` / ${post.admin_hidden_reason}` : ""}
              </p>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
            >
              投稿詳細
            </Link>
          </div>
        </div>

        {canAdminHide ? (
          <form action={adminHidePostAction} className="grid gap-2">
            <input type="hidden" name="post_id" value={post.id} />
            <textarea
              name="admin_hidden_reason"
              rows={3}
              placeholder="非公開理由・管理メモ"
              className="min-h-20 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-500"
            />
            <button className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">
              管理者として非公開にする
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: TradePostStatus }) {
  const labels: Record<TradePostStatus, string> = {
    public: "公開中",
    private: "非公開",
    consulting: "相談中",
    closed: "終了",
  };
  return (
    <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-semibold text-stone-700">
      {labels[status]}
    </span>
  );
}
