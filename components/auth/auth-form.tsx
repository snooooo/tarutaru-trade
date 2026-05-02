import Link from "next/link";
import { loginAction, signupAction } from "@/lib/actions/auth-actions";

type AuthFormProps = {
  mode: "login" | "signup";
  nextPath: string;
  error?: string;
};

export function AuthForm({ mode, nextPath, error }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <form
      action={isLogin ? loginAction : signupAction}
      className="grid gap-4 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      <input type="hidden" name="next" value={nextPath} />
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <label className="grid gap-2 text-sm font-medium text-stone-700">
        メールアドレス
        <input
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-stone-700">
        パスワード
        <input
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          minLength={6}
          required
        />
      </label>
      <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
        {isLogin ? "ログイン" : "新規登録"}
      </button>
      <p className="text-sm text-stone-600">
        {isLogin ? "アカウントがない場合は" : "登録済みの場合は"}
        <Link
          href={`${isLogin ? "/signup" : "/login"}?next=${encodeURIComponent(
            nextPath,
          )}`}
          className="ml-1 font-semibold text-stone-950 underline underline-offset-4"
        >
          {isLogin ? "新規登録" : "ログイン"}
        </Link>
      </p>
    </form>
  );
}
