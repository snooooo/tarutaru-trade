import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { deleteAccountAction } from "@/lib/actions/account-actions";
import { requireUser } from "@/lib/auth/require-user";
import {
  getReceivedInterests,
  getSentInterests,
} from "@/lib/data/interests";

type DeleteAccountPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DeleteAccountPage({
  searchParams,
}: DeleteAccountPageProps) {
  const params = await searchParams;
  await requireUser("/settings/account/delete");

  const [sent, received] = await Promise.all([
    getSentInterests(),
    getReceivedInterests(),
  ]);

  const blocking = [...sent.data, ...received.data].filter((interest) =>
    ["consulting", "completion_requested"].includes(interest.status),
  );
  const hasBlocking = blocking.length > 0;

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
          <h1 className="mt-1 text-3xl font-semibold">アカウントの削除（退会）</h1>
        </div>

        <div className="grid gap-3 rounded-md border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
            <div className="grid gap-2">
              <p className="font-semibold">退会前にご確認ください</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>表示名・X ID・フォロワー数レンジなどのプロフィール情報は削除されます。</li>
                <li>
                  公開中の交換投稿は非公開になります。完了済みの取引履歴は、相手側の記録として残りますが、表示名は「退会したユーザー」になり X ID は表示されなくなります。
                </li>
                <li>
                  確認待ちの興味あり（送信・受信）は自動でキャンセルされます。
                </li>
                <li>
                  TaruTaru Trade は MaltPeri と同じアカウントを共有しています。退会すると同じメールアドレスで TaruTaru / MaltPeri のどちらにもログインできなくなり、再登録もできません。
                </li>
                <li>退会処理は即時で行われ、取り消しはできません。</li>
              </ul>
            </div>
          </div>
        </div>

        {hasBlocking ? (
          <div className="grid gap-3 rounded-md border border-rose-200 bg-rose-50 p-5 text-sm text-rose-950">
            <p className="font-semibold">
              進行中の取引が{blocking.length}件あります
            </p>
            <p>
              相談中・完了確認中の取引が残っているため退会できません。先に各取引を完了またはキャンセルしてください。
            </p>
            <ul className="grid gap-2">
              {blocking.map((interest) => (
                <li key={interest.id}>
                  <Link
                    href={`/trades/${interest.id}`}
                    className="inline-flex items-center gap-1 underline"
                  >
                    取引 {interest.target?.display_bottle_name ?? interest.id}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <ButtonLink href="/mypage" variant="secondary">
                マイページへ戻る
              </ButtonLink>
            </div>
          </div>
        ) : (
          <form
            action={deleteAccountAction}
            className="grid gap-4 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
          >
            <div>
              <label
                htmlFor="confirmation"
                className="text-sm font-semibold text-stone-900"
              >
                確認のため「退会する」と入力してください
              </label>
              <input
                id="confirmation"
                name="confirmation"
                type="text"
                required
                autoComplete="off"
                className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm shadow-sm focus:border-stone-950 focus:outline-none"
              />
            </div>

            {params.error ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                {params.error}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <ButtonLink href="/mypage" variant="secondary">
                キャンセル
              </ButtonLink>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-md bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                退会する
              </button>
            </div>
          </form>
        )}
      </section>
    </PageShell>
  );
}
