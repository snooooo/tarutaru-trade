"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/lib/actions/like-actions";

type LikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  loginHref: string;
  disabled?: boolean;
  stopPropagation?: boolean;
  size?: "sm" | "md";
};

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  loginHref,
  disabled = false,
  stopPropagation = false,
  size = "md",
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const iconSize = size === "sm" ? 14 : 16;
  const textCls = size === "sm" ? "text-xs" : "text-sm";

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (disabled) return;

    // 楽観的更新
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));

    startTransition(async () => {
      const result = await toggleLikeAction(postId);
      if (result.status === "error") {
        if (result.message === "ログインが必要です。") {
          // ロールバックしてからログインへ
          setLiked(!nextLiked);
          setCount((c) => Math.max(0, c + (nextLiked ? -1 : 1)));
          router.push(loginHref);
          return;
        }
        // その他エラー: ロールバック
        setLiked(!nextLiked);
        setCount((c) => Math.max(0, c + (nextLiked ? -1 : 1)));
      } else {
        setLiked(result.liked);
      }
    });
  }

  const fillCls = liked
    ? "fill-rose-500 text-rose-500"
    : "fill-none text-stone-400";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending || disabled}
      aria-pressed={liked}
      aria-label={liked ? "いいね解除" : "いいね"}
      className={`inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white/90 px-2.5 py-1 ${textCls} font-medium text-stone-700 transition hover:border-stone-300 hover:bg-white disabled:opacity-60`}
    >
      <Heart
        size={iconSize}
        aria-hidden="true"
        strokeWidth={2}
        className={`transition ${fillCls}`}
      />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
