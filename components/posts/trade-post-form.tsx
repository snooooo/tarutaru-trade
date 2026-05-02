"use client";

import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { createTradePostAction } from "@/lib/actions/trade-post-actions";

const MAX_ITEMS = 3;

export function TradePostForm({ error }: { error?: string }) {
  const [offerCount, setOfferCount] = useState(1);
  const [wantCount, setWantCount] = useState(1);

  return (
    <form
      action={createTradePostAction}
      className="grid gap-6 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">投稿全体</h2>
          <p className="mt-1 text-sm text-stone-600">
            タイトルは任意です。出る / 求むが読めれば空でも構いません。
          </p>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">タイトル</span>
          <input
            name="title"
            maxLength={80}
            className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
            placeholder="例: スペイサイド同士で交換希望"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">補足条件</span>
          <textarea
            name="condition_note"
            maxLength={1000}
            rows={4}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
            placeholder={
              "例:\n出る候補はどれか1本で相談したいです。\n2本まとめてなら◯◯希望です。\n求む候補以外でも近い価格帯なら相談したいです。\n都内手渡し優先です。"
            }
          />
        </label>
      </section>

      <section className="grid gap-4 border-t border-stone-100 pt-5">
        <div>
          <h2 className="text-lg font-semibold">出る</h2>
          <p className="mt-1 text-sm text-stone-600">
            交換に出せる候補を最大3件までまとめられます。どれか1本か、まとめて希望かは補足条件に書いてください。1件目は必須です。
          </p>
        </div>
        {Array.from({ length: offerCount }, (_, index) => (
          <OfferFields
            key={index}
            index={index}
            required={index === 0}
            onRemove={
              index > 0 ? () => setOfferCount((count) => count - 1) : undefined
            }
          />
        ))}
        {offerCount < MAX_ITEMS ? (
          <button
            type="button"
            onClick={() => setOfferCount((count) => Math.min(count + 1, MAX_ITEMS))}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-950 transition hover:border-stone-950 sm:w-fit"
          >
            <Plus size={16} aria-hidden="true" />
            出る候補を追加
          </button>
        ) : null}
      </section>

      <section className="grid gap-4 border-t border-stone-100 pt-5">
        <div>
          <h2 className="text-lg font-semibold">求む</h2>
          <p className="mt-1 text-sm text-stone-600">
            欲しい候補を最大3件まで書けます。未指定にすると提案歓迎として表示されます。
          </p>
        </div>
        {Array.from({ length: wantCount }, (_, index) => (
          <WantFields
            key={index}
            index={index}
            onRemove={
              index > 0 ? () => setWantCount((count) => count - 1) : undefined
            }
          />
        ))}
        {wantCount < MAX_ITEMS ? (
          <button
            type="button"
            onClick={() => setWantCount((count) => Math.min(count + 1, MAX_ITEMS))}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-950 transition hover:border-stone-950 sm:w-fit"
          >
            <Plus size={16} aria-hidden="true" />
            求む候補を追加
          </button>
        ) : null}
      </section>

      <div className="flex justify-end border-t border-stone-100 pt-5">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          交換投稿を公開
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

function OfferFields({
  index,
  required = false,
  onRemove,
}: {
  index: number;
  required?: boolean;
  onRemove?: () => void;
}) {
  const label = `出る ${index + 1}`;

  return (
    <fieldset className="grid gap-4 rounded-md border border-stone-200 bg-stone-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-sm font-semibold text-stone-700">{label}</legend>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex size-9 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            aria-label={`${label}を削除`}
            title={`${label}を削除`}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">ボトル名</span>
        <input
          name="offer_manual_bottle_name"
          required={required}
          maxLength={120}
          className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          placeholder={required ? "例: グレンリベット12年" : "任意"}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">箱状態</span>
          <select
            name="box_condition"
            defaultValue="with_box_good"
            className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          >
            <option value="with_box_good">箱あり・良好</option>
            <option value="with_box_minor_damage">箱あり・軽い傷み</option>
            <option value="with_box_damaged">箱あり・傷みあり</option>
            <option value="no_box">箱なし</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">
            ラベル状態
          </span>
          <select
            name="label_condition"
            defaultValue="good"
            className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          >
            <option value="good">良好</option>
            <option value="minor_damage">軽い傷み</option>
            <option value="damaged">傷みあり</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">画像URL</span>
        <input
          name="image_url"
          className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          placeholder="任意"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">備考</span>
        <textarea
          name="offer_note"
          maxLength={1000}
          rows={3}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
          placeholder="任意"
        />
      </label>
    </fieldset>
  );
}

function WantFields({
  index,
  onRemove,
}: {
  index: number;
  onRemove?: () => void;
}) {
  const label = `求む ${index + 1}`;

  return (
    <fieldset className="grid gap-4 rounded-md border border-stone-200 bg-stone-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-sm font-semibold text-stone-700">{label}</legend>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex size-9 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            aria-label={`${label}を削除`}
            title={`${label}を削除`}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">ボトル名</span>
        <input
          name="want_manual_bottle_name"
          maxLength={120}
          className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          placeholder={index === 0 ? "例: グレンフィディック15年" : "任意"}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">希望条件</span>
        <textarea
          name="want_condition_note"
          maxLength={1000}
          rows={3}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
          placeholder="任意"
        />
      </label>
    </fieldset>
  );
}
