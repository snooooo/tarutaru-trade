import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { User } from "@supabase/supabase-js";
import { Activity, AlertTriangle, Search, UserCheck, UserPlus, Users } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentUser } from "@/lib/auth/require-user";
import { createAdminSupabaseClient, getAdminUserIds } from "@/lib/supabase/admin";

type AdminUsersPageProps = {
  searchParams: Promise<{
    q?: string;
    service?: string;
    profile?: string;
    active?: string;
  }>;
};

type AppActiveUserRow = {
  user_id: string | null;
  email: string | null;
  maltperi_last_active_at: string | null;
  tarutaru_last_active_at: string | null;
  service_usage: string | null;
};

type AdminProfileRow = {
  user_id: string;
  display_name: string;
  x_id: string | null;
  x_followers_range: string | null;
  shipping_preference: string | null;
  shipping_region: string | null;
  is_suspended: boolean;
  terms_accepted_at: string | null;
  created_at: string;
};

type AdminPostRow = {
  user_id: string;
  status: string;
};

type AdminInterestRow = {
  requester_user_id: string;
  receiver_user_id: string;
  status: string;
  completed_at: string | null;
};

type AdminListSupabase = {
  from: (table: string) => {
    select: (columns: string) => Promise<{
      data: unknown[] | null;
      error: { message: string } | null;
    }>;
  };
};

type UserMetrics = {
  postCount: number;
  activePostCount: number;
  interestCount: number;
  completedTradeCount: number;
};

const serviceFilters = [
  { key: "all", label: "すべて" },
  { key: "maltperi_only", label: "MaltPeriのみ" },
  { key: "tarutaru_only", label: "TaruTaruのみ" },
  { key: "both", label: "両方" },
  { key: "inactive", label: "未利用" },
] as const;

function shortId(id: string) {
  return `${id.slice(0, 8)}...`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function daysAgo(days: number) {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() - days);
  return date;
}

async function listAllAuthUsers(admin: ReturnType<typeof createAdminSupabaseClient>) {
  if (!admin) return { users: [] as User[], error: null as string | null };

  const users: User[] = [];
  let page = 1;
  const perPage = 1000;

  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) return { users, error: error.message };
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }

  return { users, error: null };
}

function incrementMetric(
  metrics: Map<string, UserMetrics>,
  userId: string,
  apply: (metric: UserMetrics) => void,
) {
  const current =
    metrics.get(userId) ??
    { postCount: 0, activePostCount: 0, interestCount: 0, completedTradeCount: 0 };
  apply(current);
  metrics.set(userId, current);
}

function serviceLabel(value: string | null | undefined) {
  switch (value) {
    case "maltperi_only":
      return "MaltPeriのみ";
    case "tarutaru_only":
      return "TaruTaruのみ";
    case "both":
      return "両方";
    default:
      return "未利用";
  }
}

function normalizeService(value?: string) {
  return serviceFilters.some((filter) => filter.key === value) ? value : "all";
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  await connection();
  const user = await getCurrentUser();
  if (!user || !getAdminUserIds().includes(user.id)) {
    redirect("/");
  }

  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() ?? "";
  const activeService = normalizeService(params.service);
  const profileFilter = params.profile === "missing" ? "missing" : "all";
  const activeFilter = params.active === "30d" ? "30d" : "all";

  const admin = createAdminSupabaseClient();
  if (!admin) {
    return (
      <PageShell>
        <h1 className="text-2xl font-semibold">ユーザ分析</h1>
        <AdminNotice message="管理者用Supabase環境変数が未設定です。" />
      </PageShell>
    );
  }

  const loose = admin as unknown as AdminListSupabase;
  const [authResult, activityResult, profileResult, postResult, interestResult] =
    await Promise.all([
      listAllAuthUsers(admin),
      loose
        .from("app_active_users")
        .select(
          "user_id,email,maltperi_last_active_at,tarutaru_last_active_at,service_usage",
        ),
      loose
        .from("trade_profiles")
        .select(
          "user_id,display_name,x_id,x_followers_range,shipping_preference,shipping_region,is_suspended,terms_accepted_at,created_at",
        ),
      loose.from("trade_posts").select("user_id,status"),
      loose
        .from("trade_interests")
        .select("requester_user_id,receiver_user_id,status,completed_at"),
    ]);

  const users = authResult.users.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const activities = new Map(
    ((activityResult.data ?? []) as AppActiveUserRow[])
      .filter((row) => row.user_id)
      .map((row) => [row.user_id as string, row]),
  );
  const profiles = new Map(
    ((profileResult.data ?? []) as AdminProfileRow[]).map((profile) => [
      profile.user_id,
      profile,
    ]),
  );
  const metrics = new Map<string, UserMetrics>();

  for (const post of (postResult.data ?? []) as AdminPostRow[]) {
    incrementMetric(metrics, post.user_id, (metric) => {
      metric.postCount += 1;
      if (post.status === "public" || post.status === "consulting") {
        metric.activePostCount += 1;
      }
    });
  }

  for (const interest of (interestResult.data ?? []) as AdminInterestRow[]) {
    const participants = [interest.requester_user_id, interest.receiver_user_id];
    for (const userId of participants) {
      incrementMetric(metrics, userId, (metric) => {
        metric.interestCount += 1;
        if (interest.completed_at || interest.status === "completed") {
          metric.completedTradeCount += 1;
        }
      });
    }
  }

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const activeSince = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentUsers = users.filter(
    (authUser) => new Date(authUser.created_at) >= currentMonthStart,
  );
  const active30d = users.filter((authUser) => {
    const activity = activities.get(authUser.id);
    const lastActive = [
      activity?.maltperi_last_active_at,
      activity?.tarutaru_last_active_at,
    ]
      .filter((value): value is string => Boolean(value))
      .map((value) => new Date(value).getTime());
    return lastActive.some((value) => value >= activeSince.getTime());
  });

  const trendDays = Array.from({ length: 14 }, (_, index) => {
    const day = daysAgo(13 - index);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const count = users.filter((authUser) => {
      const createdAt = new Date(authUser.created_at);
      return createdAt >= day && createdAt < next;
    }).length;
    return {
      key: day.toISOString(),
      label: `${day.getMonth() + 1}/${day.getDate()}`,
      count,
    };
  });
  const maxTrendCount = Math.max(...trendDays.map((day) => day.count), 1);

  const rows = users
    .map((authUser) => {
      const activity = activities.get(authUser.id);
      const profile = profiles.get(authUser.id);
      const metric =
        metrics.get(authUser.id) ??
        { postCount: 0, activePostCount: 0, interestCount: 0, completedTradeCount: 0 };
      const lastActiveAt = [
        activity?.maltperi_last_active_at,
        activity?.tarutaru_last_active_at,
      ]
        .filter((value): value is string => Boolean(value))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

      return {
        authUser,
        activity,
        profile,
        metric,
        lastActiveAt,
        serviceUsage: activity?.service_usage ?? "inactive",
      };
    })
    .filter((row) => {
      if (activeService !== "all" && row.serviceUsage !== activeService) return false;
      if (profileFilter === "missing" && row.profile) return false;
      if (
        activeFilter === "30d" &&
        (!row.lastActiveAt || new Date(row.lastActiveAt) < activeSince)
      ) {
        return false;
      }
      if (!query) return true;
      const haystack = [
        row.authUser.id,
        row.authUser.email,
        row.profile?.display_name,
        row.profile?.x_id,
        row.profile?.shipping_region,
        row.profile?.x_followers_range,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

  const error =
    authResult.error ??
    activityResult.error?.message ??
    profileResult.error?.message ??
    postResult.error?.message ??
    interestResult.error?.message ??
    null;

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold">ユーザ分析</h1>
          <p className="mt-2 text-sm text-stone-500">
            Auth登録日を基準に、プロフィールと利用状況を重ねて確認します。
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-md px-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100"
        >
          ダッシュボードへ
        </Link>
      </div>

      {error ? <AdminNotice message={error} /> : null}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="登録ユーザ"
          value={users.length}
          icon={<Users size={18} aria-hidden="true" />}
        />
        <SummaryCard
          label="今月の新規"
          value={recentUsers.length}
          icon={<UserPlus size={18} aria-hidden="true" />}
        />
        <SummaryCard
          label="プロフィール作成済み"
          value={profiles.size}
          icon={<UserCheck size={18} aria-hidden="true" />}
        />
        <SummaryCard
          label="30日アクティブ"
          value={active30d.length}
          icon={<Activity size={18} aria-hidden="true" />}
        />
      </section>

      <section className="mt-6 rounded-md border border-stone-200 bg-white/82 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-stone-700">直近14日の新規登録</h2>
          <span className="text-xs text-stone-400">Auth登録日ベース</span>
        </div>
        <div
          className="mt-4 grid h-40 items-end gap-2"
          style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
        >
          {trendDays.map((day) => (
            <div key={day.key} className="grid min-w-0 gap-2 text-center">
              <div
                className="mx-auto w-full rounded-t bg-stone-800"
                style={{ height: `${Math.max((day.count / maxTrendCount) * 100, day.count ? 12 : 2)}px` }}
                title={`${day.label}: ${day.count}人`}
              />
              <div className="text-[10px] leading-none text-stone-400">{day.label}</div>
            </div>
          ))}
        </div>
      </section>

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
            placeholder="email、表示名、X ID、ユーザID、地域で検索"
            className="h-11 w-full rounded-md border border-stone-300 bg-white/80 pl-9 pr-3 text-sm outline-none transition focus:border-stone-500"
          />
        </div>
        {activeService !== "all" ? (
          <input type="hidden" name="service" value={activeService} />
        ) : null}
        {profileFilter === "missing" ? (
          <input type="hidden" name="profile" value="missing" />
        ) : null}
        {activeFilter === "30d" ? <input type="hidden" name="active" value="30d" /> : null}
        <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          検索
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {serviceFilters.map((filter) => (
          <FilterLink
            key={filter.key}
            active={activeService === filter.key && profileFilter === "all" && activeFilter === "all"}
            href={`/admin/users${filter.key === "all" ? "" : `?service=${filter.key}`}`}
          >
            {filter.label}
          </FilterLink>
        ))}
        <FilterLink active={profileFilter === "missing"} href="/admin/users?profile=missing">
          プロフィール未作成
        </FilterLink>
        <FilterLink active={activeFilter === "30d"} href="/admin/users?active=30d">
          30日アクティブ
        </FilterLink>
      </div>

      <section className="mt-5 overflow-hidden rounded-md border border-stone-200 bg-white/82">
        <div className="border-b border-stone-200 px-4 py-3 text-sm text-stone-500">
          表示中 {rows.length}人 / 全 {users.length}人
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">ユーザ</th>
                <th className="px-4 py-3">登録日</th>
                <th className="px-4 py-3">サービス</th>
                <th className="px-4 py-3">最終アクティブ</th>
                <th className="px-4 py-3">プロフィール</th>
                <th className="px-4 py-3">行動</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((row) => (
                <tr key={row.authUser.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-950">
                      {row.authUser.email ?? "(emailなし)"}
                    </div>
                    <div className="mt-1 font-mono text-xs text-stone-400">
                      {shortId(row.authUser.id)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {formatDate(row.authUser.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-semibold text-stone-700">
                      {serviceLabel(row.serviceUsage)}
                    </span>
                    <div className="mt-2 grid gap-1 text-xs text-stone-500">
                      <span>MaltPeri {formatDateTime(row.activity?.maltperi_last_active_at)}</span>
                      <span>TaruTaru {formatDateTime(row.activity?.tarutaru_last_active_at)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {formatDateTime(row.lastActiveAt)}
                  </td>
                  <td className="px-4 py-3">
                    {row.profile ? (
                      <div className="grid gap-1 text-stone-600">
                        <div className="font-medium text-stone-900">
                          {row.profile.display_name}
                          {row.profile.is_suspended ? (
                            <span className="ml-2 rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                              停止中
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs">
                          {row.profile.x_id ? `@${row.profile.x_id}` : "X IDなし"}
                          {" / "}
                          {row.profile.x_followers_range ?? "フォロワー未設定"}
                        </div>
                        <div className="text-xs">
                          {row.profile.shipping_region ?? "地域未設定"}
                          {" / "}
                          {row.profile.shipping_preference ?? "発送希望未設定"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-stone-400">未作成</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    <div className="grid gap-1 text-xs">
                      <span>投稿 {row.metric.postCount}件 / 公開・相談 {row.metric.activePostCount}件</span>
                      <span>やりとり {row.metric.interestCount}件</span>
                      <span>完了 {row.metric.completedTradeCount}件</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-stone-400">
            条件に一致するユーザはいません。
          </p>
        ) : null}
      </section>
    </PageShell>
  );
}

function AdminNotice({ message }: { message: string }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-stone-200 bg-white/82 p-5">
      <div className="flex items-center justify-between gap-3 text-sm font-medium text-stone-500">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums text-stone-950">
        {value}
      </p>
    </div>
  );
}

function FilterLink({
  active,
  href,
  children,
}: {
  active: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center rounded-md border px-3 text-sm font-semibold transition ${
        active
          ? "border-stone-950 bg-stone-950 text-white"
          : "border-stone-200 bg-white/80 text-stone-600 hover:bg-stone-100"
      }`}
    >
      {children}
    </Link>
  );
}
