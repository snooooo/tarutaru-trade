"use client";

import { useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Mail, ChevronDown } from "lucide-react";

type CheckEmailNoticeProps = {
  nextPath: string;
  error?: string;
};

export function CheckEmailNotice({ nextPath, error }: CheckEmailNoticeProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="grid gap-4">
      {/* 確認メール待ちカード */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Mail size={18} className="text-amber-700" aria-hidden="true" />
          </div>
          <div className="grid gap-1.5">
            <p className="font-semibold text-amber-900">
              確認メールを送信しました
            </p>
            <p className="text-sm leading-6 text-amber-800">
              受信トレイに <strong>MaltPeri ID</strong>{" "}
              名義でメールが届いています。メール内の「確認する」ボタンを押してください。
            </p>
            <p className="text-sm leading-6 text-amber-800">
              ※「確認する」を押すと一度 MaltPeri
              のページに移動しますが、そのまま TaruTaruTrade
              にリダイレクトされます。
            </p>
          </div>
        </div>
      </div>

      {/* ログインフォームの折りたたみ */}
      <div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-950"
        >
          <span>メールを確認済みの方はこちらからログイン</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-200 ${showForm ? "rotate-180" : ""}`}
          />
        </button>

        {showForm ? (
          <div className="mt-3">
            <AuthForm mode="login" nextPath={nextPath} error={error} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
