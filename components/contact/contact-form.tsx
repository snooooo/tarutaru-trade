"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import Link from "next/link";

type FormStatus = "idle" | "submitting" | "success" | "error";

const SUBJECTS = [
  "サービス全般について",
  "アカウント・ログインについて",
  "トレード投稿・取引について",
  "不正・迷惑行為の報告",
  "機能のご要望・ご提案",
  "その他",
];

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/contact-form.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          data as unknown as Record<string, string>
        ).toString(),
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "送信中にエラーが発生しました。しばらく経ってから再度お試しください。"
      );
    }
  }

  if (status === "success") {
    return (
      <div className="grid gap-6 text-center">
        <CheckCircle
          size={48}
          className="mx-auto text-green-600"
          aria-hidden="true"
        />
        <div>
          <p className="text-xl font-semibold text-stone-950">
            送信が完了しました
          </p>
          <p className="mt-3 leading-7 text-stone-600">
            お問い合わせありがとうございます。
            <br />
            内容を確認のうえ、折り返しご連絡いたします。
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          トップページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="grid gap-6"
    >
      {/* Netlify 必須の hidden フィールド */}
      <input type="hidden" name="form-name" value="contact" />

      {/* ハニーポット（スパム対策） */}
      <p className="hidden" aria-hidden="true">
        <label>
          このフィールドは入力しないでください：
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-2">
        <label
          htmlFor="contact-subject"
          className="text-sm font-medium text-stone-700"
        >
          お問い合わせ種別
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue=""
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
        >
          <option value="" disabled>
            選択してください
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-stone-700"
        >
          返信先メールアドレス
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          placeholder="example@email.com"
          autoComplete="email"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
        />
        <p className="text-xs text-stone-500">
          MaltPeri IDに登録したアドレスを推奨します。
        </p>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-stone-700"
        >
          お問い合わせ内容
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="お問い合わせ内容をできるだけ詳しくご記入ください。"
          className="w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
        />
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <button
        id="contact-submit"
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={16} aria-hidden="true" />
        {status === "submitting" ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
