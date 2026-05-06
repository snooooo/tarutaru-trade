"use client";

import { Check, Search, X } from "lucide-react";
import { useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { BottleSearchResult } from "@/lib/types/bottle";

function bottleSubline(bottle: BottleSearchResult) {
  return [
    bottle.brand_name,
    bottle.distillery_name_ja,
    bottle.country,
    bottle.category,
  ]
    .filter(Boolean)
    .join(" / ");
}

function safeSearchPattern(value: string) {
  return `%${value.replace(/[%_,]/g, " ").trim()}%`;
}

export function BottleSearchField() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BottleSearchResult[]>([]);
  const [selected, setSelected] = useState<BottleSearchResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  function searchBottles() {
    const term = query.trim();

    if (!term || term.length < 2) {
      setMessage("2文字以上で検索してください。");
      setResults([]);
      return;
    }

    if (!isConfigured) {
      setMessage("Supabase環境変数が未設定のため検索できません。");
      setResults([]);
      return;
    }

    startTransition(async () => {
      const pattern = safeSearchPattern(term);
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("bottles")
        .select("id,bottle_name,brand_name,distillery_name_ja,country,category")
        .or(
          [
            `bottle_name.ilike.${pattern}`,
            `brand_name.ilike.${pattern}`,
            `distillery_name_ja.ilike.${pattern}`,
            `country.ilike.${pattern}`,
            `category.ilike.${pattern}`,
          ].join(","),
        )
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("bottle_name", { ascending: true })
        .limit(12);

      if (error) {
        setMessage(error.message);
        setResults([]);
        return;
      }

      setMessage(data?.length ? null : "該当するボトルが見つかりません。");
      setResults((data ?? []) as BottleSearchResult[]);
    });
  }

  return (
    <div className="grid gap-3">
      <input
        type="hidden"
        name="maltperi_bottle_id"
        value={selected?.id ?? ""}
      />

      <div className="flex gap-2">
        <input
          className="h-11 min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              searchBottles();
            }
          }}
          placeholder="例: 山崎 12年、Macallan"
          type="search"
        />
        <button
          className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          disabled={isPending}
          onClick={searchBottles}
          type="button"
        >
          <Search size={16} aria-hidden="true" />
          <span className="ml-2 hidden sm:inline">
            {isPending ? "検索中" : "検索"}
          </span>
        </button>
      </div>

      {selected ? (
        <div className="flex items-start justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
          <span className="flex min-w-0 items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="block font-medium">{selected.bottle_name}</span>
              {bottleSubline(selected) ? (
                <span className="block text-emerald-800">
                  {bottleSubline(selected)}
                </span>
              ) : null}
            </span>
          </span>
          <button
            className="rounded p-1 text-emerald-900 transition hover:bg-emerald-100"
            onClick={() => setSelected(null)}
            title="選択を解除"
            type="button"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {message ? <p className="text-sm text-stone-600">{message}</p> : null}

      {results.length ? (
        <div className="max-h-48 overflow-y-auto rounded-md border border-stone-200 bg-white shadow-sm">
          {results.map((bottle) => (
            <button
              className="grid w-full gap-1 border-b border-stone-100 px-3 py-3 text-left transition last:border-b-0 hover:bg-stone-50"
              key={bottle.id}
              onClick={() => {
                setSelected(bottle);
                setResults([]);
                setMessage(null);
              }}
              type="button"
            >
              <span className="font-medium text-stone-950">
                {bottle.bottle_name}
              </span>
              {bottleSubline(bottle) ? (
                <span className="text-sm text-stone-600">
                  {bottleSubline(bottle)}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
