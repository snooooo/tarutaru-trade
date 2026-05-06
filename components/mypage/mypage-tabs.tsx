"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
}: {
  children: Record<TabKey, React.ReactNode>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = (searchParams.get("tab") as TabKey) || "posts";

  function handleTabChange(key: TabKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`?${params.toString()}`, { scroll: false });
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
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-500 hover:text-stone-700 hover:bg-white/50"
              }`}
            >
              {tab.icon}
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
