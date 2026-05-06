import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";

type SignupPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

async function SignupContent({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/settings/profile";

  return (
    <section className="mx-auto grid max-w-md gap-6">
      <div>
        <p className="text-sm font-medium text-stone-500">Signup</p>
        <h1 className="mt-1 text-3xl font-semibold">MaltPeri ID 新規登録</h1>
        <p className="mt-3 text-stone-700">
          登録後にプロフィール欄を記入すると、トレードの準備ができるようになります。
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-stone-500">
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 size-4 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" className="fill-emerald-100" />
              <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              MaltPeri ID は{" "}
              <a
                href="https://maltperi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                MaltPeri
              </a>{" "}
              と TaruTaruTrade で共通のアカウントです。
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 size-4 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" className="fill-emerald-100" />
              <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              MaltPeri ID をお持ちの方は新規登録不要です。{" "}
              <a href="/login" className="underline underline-offset-4">
                ログインへどうぞ。
              </a>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 size-4 shrink-0 text-emerald-500" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" className="fill-emerald-100" />
              <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>確認メールは MaltPeri ID 名義で届きます。</span>
          </li>
        </ul>
      </div>
      <AuthForm mode="signup" nextPath={nextPath} error={params.error} />
    </section>
  );
}

export default function SignupPage(props: SignupPageProps) {
  return (
    <PageShell>
      <Suspense>
        <SignupContent {...props} />
      </Suspense>
    </PageShell>
  );
}
