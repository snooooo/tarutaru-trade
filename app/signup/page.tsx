import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";

type SignupPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/settings/profile";

  return (
    <PageShell>
      <section className="mx-auto grid max-w-md gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">Signup</p>
          <h1 className="mt-1 text-3xl font-semibold">新規登録</h1>
          <p className="mt-3 text-stone-700">
            登録後に取引用プロフィールを整えると、掲載と興味ありへ進めます。
          </p>
        </div>
        <AuthForm mode="signup" nextPath={nextPath} error={params.error} />
      </section>
    </PageShell>
  );
}
