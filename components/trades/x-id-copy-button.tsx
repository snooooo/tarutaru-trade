"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function XIdCopyButton({ xId }: { xId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック：古いブラウザ対応
      const textarea = document.createElement("textarea");
      textarea.value = xId;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition ${
        copied
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-stone-300 bg-white/70 text-stone-950 hover:bg-white"
      }`}
      aria-label="X IDをクリップボードにコピー"
    >
      {copied ? (
        <>
          <Check size={16} aria-hidden="true" />
          コピーしました
        </>
      ) : (
        <>
          <Copy size={16} aria-hidden="true" />
          IDをコピー
        </>
      )}
    </button>
  );
}
