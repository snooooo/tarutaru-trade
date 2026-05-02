import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";

  return (
    <PageShell>
      <section className="mx-auto grid max-w-md gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">Login</p>
          <h1 className="mt-1 text-3xl font-semibold">ログイン</h1>
          <p className="mt-3 text-stone-700">
            掲載、興味あり、プロフィール編集にはログインが必要です。
          </p>
        </div>
        <AuthForm mode="login" nextPath={nextPath} error={params.error} />
      </section>
    </PageShell>
  );
}
