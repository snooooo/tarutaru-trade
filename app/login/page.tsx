import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { CheckEmailNotice } from "@/components/auth/check-email-notice";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    signup?: string;
  }>;
};

async function LoginContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";
  const isCheckEmail = params.signup === "check_email";

  return (
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
        <p className="text-sm font-medium text-stone-500">
          {isCheckEmail ? "Signup" : "Login"}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">
          {isCheckEmail ? "確認メールを送信しました" : "ログイン"}
        </h1>
        {!isCheckEmail && (
          <>
            <p className="mt-3 text-stone-700">
              掲載、興味あり、プロフィール編集にはログインが必要です。
            </p>
            <p className="mt-2 text-sm text-stone-500">
              MaltPeri ID をお持ちの方は、そのままログインできます。
            </p>
          </>
        )}
      </div>
      {isCheckEmail ? (
        <CheckEmailNotice nextPath={nextPath} error={params.error} />
      ) : (
        <AuthForm mode="login" nextPath={nextPath} error={params.error} />
      )}
    </section>
  );
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <PageShell>
      <Suspense>
        <LoginContent {...props} />
      </Suspense>
    </PageShell>
  );
}
