"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  Eye,
  EyeOff,
  Handshake,
  MessageCircle,
  Pencil,
  XCircle,
} from "lucide-react";
import type { MyTradePost } from "@/lib/types/trade-posts";

type StatusFilter = "all" | "public" | "private" | "consulting" | "closed";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  public: {
    label: "公開中",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <Eye size={12} aria-hidden="true" />,
  },
  private: {
    label: "非公開",
    color: "bg-stone-100 text-stone-600 border-stone-200",
    icon: <EyeOff size={12} aria-hidden="true" />,
  },
  consulting: {
    label: "相談中",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <MessageCircle size={12} aria-hidden="true" />,
  },
  closed: {
    label: "終了",
    color: "bg-stone-100 text-stone-500 border-stone-200",
    icon: <XCircle size={12} aria-hidden="true" />,
  },
};

const filterTabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "public", label: "公開中" },
  { key: "private", label: "非公開" },
  { key: "consulting", label: "相談中" },
  { key: "closed", label: "終了" },
];

function bottleLabel(
  items: { display_bottle_name: string | null }[],
  fallback: string,
): string {
  if (!items.length) return fallback;
  const name = items[0].display_bottle_name ?? fallback;
  if (items.length > 1) return `${name} ほか${items.length - 1}件`;
  return name;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function MyTradePostList({ posts }: { posts: MyTradePost[] }) {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="grid gap-3">
      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
        {filterTabs.map((tab) => {
          const count =
            tab.key === "all" ? posts.length : (counts[tab.key] ?? 0);
          if (tab.key !== "all" && count === 0) return null;
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-stone-950 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-stone-200 text-stone-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Post list */}
      {filtered.length ? (
        <div className="grid gap-2">
          {filtered.map((post) => (
            <CompactPostRow key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-stone-300 bg-white/62 px-4 py-8 text-center text-sm text-stone-500">
          該当する投稿はありません
        </p>
      )}
    </div>
  );
}

function CompactPostRow({ post }: { post: MyTradePost }) {
  const config = statusConfig[post.status] ?? statusConfig.public;
  const offerLabel = bottleLabel(post.offer_items, "名称未設定");
  const wantLabel = bottleLabel(post.want_items, "提案歓迎");
  const title = post.title || offerLabel;
  const dateStr = formatShortDate(post.published_at ?? post.created_at);
  const canEdit =
    post.status === "public" || post.status === "private";

  return (
    <article className="group grid gap-2 rounded-md border border-stone-200 bg-white/82 p-3.5 shadow-sm transition hover:border-stone-300 hover:bg-white sm:p-4">
      {/* Row 1: status + title + date */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${config.color}`}
        >
          {config.icon}
          {config.label}
        </span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-900">
          {title}
        </h3>
        <span className="shrink-0 text-xs tabular-nums text-stone-400">
          {dateStr}
        </span>
      </div>

      {/* Row 2: offer → want */}
      <div className="flex items-center gap-2 text-sm text-stone-600">
        <span className="min-w-0 flex-1 truncate">
          <span className="font-medium text-stone-500">出</span>{" "}
          {offerLabel}
        </span>
        <ArrowUpDown
          size={12}
          className="shrink-0 text-stone-400"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate">
          <span className="font-medium text-stone-500">求</span>{" "}
          {wantLabel}
        </span>
      </div>

      {/* Row 3: actions */}
      <div className="flex items-center gap-2 pt-0.5">
        {post.status === "public" ? (
          <Link
            href={`/posts/${post.id}`}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
          >
            <Handshake size={13} aria-hidden="true" />
            公開表示
          </Link>
        ) : null}
        {canEdit ? (
          <Link
            href={`/mypage/posts/${post.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
          >
            <Pencil size={13} aria-hidden="true" />
            編集
          </Link>
        ) : null}
        <Link
          href={`/mypage/posts/${post.id}/edit`}
          className="ml-auto inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
        >
          詳細
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
