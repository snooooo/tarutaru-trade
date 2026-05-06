"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  Send,
  XCircle,
  Ban,
} from "lucide-react";
import type {
  TradeInterestListItem,
  TradeInterestStatus,
} from "@/lib/types/interests";
import { formatDate } from "@/lib/format/trade";

type InteractionFilter =
  | "all"
  | "action_needed"
  | "in_progress"
  | "done";

type InteractionItem = TradeInterestListItem & {
  direction: "sent" | "received";
};

const statusMeta: Record<
  TradeInterestStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  interested: {
    label: "確認待ち",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock size={12} aria-hidden="true" />,
  },
  consulting: {
    label: "相談中",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    icon: <Clock size={12} aria-hidden="true" />,
  },
  completion_requested: {
    label: "完了確認中",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    icon: <CheckCircle2 size={12} aria-hidden="true" />,
  },
  completed: {
    label: "完了",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={12} aria-hidden="true" />,
  },
  dismissed: {
    label: "見送り",
    color: "bg-stone-100 text-stone-500 border-stone-200",
    icon: <XCircle size={12} aria-hidden="true" />,
  },
  canceled: {
    label: "キャンセル",
    color: "bg-stone-100 text-stone-500 border-stone-200",
    icon: <Ban size={12} aria-hidden="true" />,
  },
};

function classifyFilter(item: InteractionItem): InteractionFilter {
  if (item.status === "interested") return "action_needed";
  if (item.status === "consulting" || item.status === "completion_requested")
    return "in_progress";
  return "done";
}

export function InteractionsList({
  sent,
  received,
}: {
  sent: TradeInterestListItem[];
  received: TradeInterestListItem[];
}) {
  const [filter, setFilter] = useState<InteractionFilter>("all");

  const allItems: InteractionItem[] = [
    ...received.map((i) => ({ ...i, direction: "received" as const })),
    ...sent.map((i) => ({ ...i, direction: "sent" as const })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const counts: Record<InteractionFilter, number> = {
    all: allItems.length,
    action_needed: allItems.filter((i) => classifyFilter(i) === "action_needed").length,
    in_progress: allItems.filter((i) => classifyFilter(i) === "in_progress").length,
    done: allItems.filter((i) => classifyFilter(i) === "done").length,
  };

  const filterTabs: { key: InteractionFilter; label: string }[] = [
    { key: "all", label: "すべて" },
    { key: "action_needed", label: "要対応" },
    { key: "in_progress", label: "進行中" },
    { key: "done", label: "完了・終了" },
  ];

  const filtered =
    filter === "all"
      ? allItems
      : allItems.filter((i) => classifyFilter(i) === filter);

  return (
    <div className="grid gap-3">
      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
        {filterTabs.map((tab) => {
          const count = counts[tab.key];
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

      {/* List */}
      {filtered.length ? (
        <div className="grid gap-2">
          {filtered.map((item) => (
            <InteractionRow key={`${item.direction}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-stone-300 bg-white/62 px-4 py-8 text-center text-sm text-stone-500">
          該当するやりとりはありません
        </p>
      )}
    </div>
  );
}

function InteractionRow({ item }: { item: InteractionItem }) {
  const meta = statusMeta[item.status];
  const dirIcon =
    item.direction === "received" ? (
      <Inbox size={13} className="text-stone-400" aria-hidden="true" />
    ) : (
      <Send size={13} className="text-stone-400" aria-hidden="true" />
    );
  const dirLabel = item.direction === "received" ? "受信" : "送信";

  const targetName = item.target?.display_bottle_name ?? "対象ボトル";
  const proposedName =
    item.proposedOffer?.display_bottle_name ?? "名称未設定のボトル";

  // Link to trade detail if consulting+, otherwise to interests list
  const href =
    item.status === "interested" || item.status === "dismissed" || item.status === "canceled"
      ? `/mypage/interests/${item.direction}`
      : `/trades/${item.id}`;

  return (
    <Link
      href={href}
      className="group grid gap-2 rounded-md border border-stone-200 bg-white/82 p-3.5 shadow-sm transition hover:border-stone-300 hover:bg-white sm:p-4"
    >
      {/* Row 1: status + direction + date */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${meta.color}`}
        >
          {meta.icon}
          {meta.label}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-stone-400">
          {dirIcon}
          {dirLabel}
        </span>
        <span className="ml-auto shrink-0 text-xs tabular-nums text-stone-400">
          {formatDate(item.created_at)}
        </span>
      </div>

      {/* Row 2: bottle info */}
      <div className="text-sm">
        <p className="truncate font-semibold text-stone-900">{targetName}</p>
        <p className="mt-0.5 truncate text-stone-600">
          <span className="font-medium text-stone-500">候補:</span>{" "}
          {proposedName}
        </p>
      </div>

      {/* Row 3: action */}
      <div className="flex items-center justify-end">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 group-hover:text-stone-700">
          詳細
          <ArrowRight size={12} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
