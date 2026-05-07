"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package, MessageSquare, Settings } from "lucide-react";

export type TabKey = "posts" | "interactions" | "account";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "posts",
    label: "投稿",
    icon: <Package size={16} aria-hidden="true" />,
  },
  {
    key: "interactions",
    label: "やりとり",
    icon: <MessageSquare size={16} aria-hidden="true" />,
  },
  {
    key: "account",
    label: "アカウント",
    icon: <Settings size={16} aria-hidden="true" />,
  },
];

export function MyPageTabs({
  children,
  interactionsPendingCount = 0,
}: {
  children: Record<TabKey, React.ReactNode>;
  interactionsPendingCount?: number;
}) {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<TabKey>(
    () => (searchParams.get("tab") as TabKey) || "posts",
  );

  function handleTabChange(key: TabKey) {
    setActive(key);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("tab", key);
      window.history.replaceState(null, "", `?${params.toString()}`);
    }
  }

  return (
    <>
      {/* Tab bar */}
      <nav
        className="flex gap-1 rounded-lg border border-stone-200 bg-stone-100/80 p-1 shadow-sm"
        role="tablist"
        aria-label="マイページナビゲーション"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const hasPending =
            tab.key === "interactions" && interactionsPendingCount > 0;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.key)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-500 hover:text-stone-700 hover:bg-white/50"
              }`}
            >
              <span className="relative inline-flex items-center">
                {tab.icon}
                {hasPending ? (
                  <span
                    aria-label={`対応待ち ${interactionsPendingCount}件`}
                    className="absolute -top-1 -right-1.5 inline-flex h-2 w-2 rounded-full bg-rose-600 ring-2 ring-stone-100"
                  />
                ) : null}
              </span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Active tab content */}
      <div role="tabpanel">{children[active]}</div>
    </>
  );
}
