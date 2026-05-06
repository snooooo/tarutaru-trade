import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { updatePasswordAction } from "@/lib/actions/account-actions";
import { requireUser } from "@/lib/auth/require-user";

type PasswordPageProps = {
  searchParams: Promise<{ error?: string; updated?: string }>;
};

export default async function PasswordPage({ searchParams }: PasswordPageProps) {
  const params = await searchParams;
  await requireUser("/settings/account/password");

  return (
    <PageShell>
      <section className="mx-auto grid max-w-2xl gap-6">
        <div>
          <Link
            href="/mypage"
            className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-950"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            マイページに戻る
          </Link>
          <p className="mt-3 text-sm font-medium text-stone-500">Account</p>
          <h1 className="mt-1 text-3xl font-semibold">パスワードの変更</h1>
        </div>

        {params.updated ? (
          <p className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={16} aria-hidden="true" />
            パスワードを更新しました。
          </p>
        ) : null}

        {params.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {params.error}
          </p>
        ) : null}

        <form
          action={updatePasswordAction}
          className="grid gap-4 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
        >
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            新しいパスワード
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            新しいパスワード（確認）
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
            />
          </label>
          <p className="text-xs text-stone-500">
            8文字以上で、英字と数字を含める必要があります。
          </p>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              パスワードを更新する
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
