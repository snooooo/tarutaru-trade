"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      投稿一覧に戻る
    </button>
  );
}
