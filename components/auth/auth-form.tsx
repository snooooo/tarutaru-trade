"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { loginAction, signupAction } from "@/lib/actions/auth-actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          処理中…
        </>
      ) : (
        label
      )}
    </button>
  );
}

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
      {isLogin ? null : (
        <label className="flex items-start gap-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
          <input
            className="mt-1 size-5"
            type="checkbox"
            name="terms_accepted"
            required
          />
          <span>
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-950 underline underline-offset-4 hover:text-stone-700"
            >
              利用規約
            </Link>
            および
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-950 underline underline-offset-4 hover:text-stone-700"
            >
              プライバシーポリシー
            </Link>
            に同意します
          </span>
        </label>
      )}
      <SubmitButton label={isLogin ? "ログイン" : "新規登録"} />
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
