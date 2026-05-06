"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TradePostCard } from "@/components/posts/trade-post-card";
import type { PublicTradePost } from "@/lib/types/trade-posts";

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 8;

export function PaginatedTradePostList({
  posts,
  className = "grid gap-3 lg:grid-cols-2",
}: {
  posts: PublicTradePost[];
  className?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visible = posts.slice(0, visibleCount);
  const remaining = posts.length - visibleCount;

  if (!posts.length) {
    return (
      <div className="grid gap-4 rounded-md border border-dashed border-stone-300 bg-white/62 p-6 text-stone-700">
        <div>
          <h2 className="font-semibold text-stone-950">
            トレード投稿はまだありません
          </h2>
          <p className="mt-1 text-sm">
            出る / 求むをまとめた投稿が公開されると、ここに表示されます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className={className}>
        {visible.map((post) => (
          <TradePostCard key={post.id} post={post} />
        ))}
      </div>
      {remaining > 0 ? (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-white"
          >
            <ChevronDown size={16} aria-hidden="true" />
            もっと見る（残り{remaining}件）
          </button>
        </div>
      ) : null}
    </div>
  );
}
