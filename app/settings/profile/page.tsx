import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ProfileForm } from "@/components/profiles/profile-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireUser } from "@/lib/auth/require-user";
import { getMyTradeProfile } from "@/lib/data/profiles";
import { isCompleteTradeProfile } from "@/lib/validators/profile";

type ProfilePageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    reason?: string;
    signup?: string;
    profile_saved?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const hasNext = typeof params.next === "string" && params.next.startsWith("/");
  const nextPath = hasNext ? (params.next as string) : "/settings/profile";
  await requireUser(
    hasNext ? `/settings/profile?next=${encodeURIComponent(nextPath)}` : "/settings/profile",
  );
  const { profile, error, isConfigured } = await getMyTradeProfile();
  const isComplete = isCompleteTradeProfile(profile);

  return (
    <PageShell>
      <section className="mx-auto grid max-w-3xl gap-6">
        <Link
          href="/mypage"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          マイページに戻る
        </Link>
        <div>
          <p className="text-sm font-medium text-stone-500">Settings</p>
          <h1 className="mt-1 text-3xl font-semibold">取引用プロフィール</h1>
          <p className="mt-3 text-stone-700">
            公開される表示名と、相談開始後にだけ使うX IDまわりの情報を管理します。
          </p>
        </div>

        <DataStatusNote
          isConfigured={isConfigured}
          error={error ?? params.error ?? null}
        />

        {params.signup ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            メール確認が有効な場合は、確認後にログイン状態になります。確認不要な設定ならこのままプロフィールを保存できます。
          </p>
        ) : null}

        {params.reason === "complete_profile" ? (
          <p className="rounded-md border border-stone-200 bg-white/82 px-4 py-3 text-sm text-stone-700">
            掲載・興味ありの前に、X ID、フォロワー数レンジ、配送時の住所等の開示、規約同意を完了してください。
          </p>
        ) : null}

        {isComplete ? (
          <p className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={16} aria-hidden="true" />
            掲載・興味ありへ進めるプロフィールです。
          </p>
        ) : null}

        <ProfileForm profile={profile} nextPath={nextPath} />
      </section>
    </PageShell>
  );
}
