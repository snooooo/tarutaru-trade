import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    signup?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";

  return (
    <PageShell>
      <section className="mx-auto grid max-w-md gap-6">
        {params.next?.startsWith("/") ? (
          <a
            href={params.next}
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            戻る
          </a>
        ) : null}
        <div>
          <p className="text-sm font-medium text-stone-500">Login</p>
          <h1 className="mt-1 text-3xl font-semibold">ログイン</h1>
          <p className="mt-3 text-stone-700">
            掲載、興味あり、プロフィール編集にはログインが必要です。
          </p>
          <p className="mt-2 text-sm text-stone-500">
            <a
              href="https://maltperi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              MaltPeri
            </a>{" "}
            のアカウントをお持ちの方は、そのままログインできます。
          </p>
        </div>
        {params.signup === "check_email" ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            確認メールをMaltPeri名義で送信しました。メール内のリンクを開いてからログインしてください。
          </p>
        ) : null}
        <AuthForm mode="login" nextPath={nextPath} error={params.error} />
      </section>
    </PageShell>
  );
}
