"use client";

import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { createPostInterestAction } from "@/lib/actions/interest-actions";
import type { PublicTradePost } from "@/lib/types/trade-posts";

const MAX_ITEMS = 3;

export function PostInterestCreateForm({
  post,
  returnPath,
}: {
  post: PublicTradePost;
  returnPath: string;
}) {
  const [itemCount, setItemCount] = useState(1);

  return (
    <form
      action={createPostInterestAction}
      className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      <input type="hidden" name="target_trade_post_id" value={post.id} />
      <input type="hidden" name="return_path" value={returnPath} />

      <div>
        <h2 className="text-lg font-semibold">この相談で出せる候補</h2>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          候補は確定トレード品ではありません。相手が相談開始したら、この候補すべてが相談中として扱われ、X IDが相互開示されます。
        </p>
      </div>

      <div className="grid gap-3">
        {Array.from({ length: itemCount }, (_, index) => (
          <ProposalOfferFields
            key={index}
            index={index}
            required={index === 0}
            onRemove={
              index > 0 ? () => setItemCount((count) => count - 1) : undefined
            }
          />
        ))}
      </div>

      {itemCount < MAX_ITEMS ? (
        <button
          type="button"
          onClick={() => setItemCount((count) => Math.min(count + 1, MAX_ITEMS))}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-950 transition hover:border-stone-950 sm:w-fit"
        >
          <Plus size={16} aria-hidden="true" />
          候補を追加
        </button>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-stone-100 pt-5 sm:flex-row">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          トレードに興味ありを送る
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

function ProposalOfferFields({
  index,
  required,
  onRemove,
}: {
  index: number;
  required: boolean;
  onRemove?: () => void;
}) {
  const label = `候補 ${index + 1}`;

  return (
    <fieldset className="grid gap-4 rounded-md border border-stone-200 bg-stone-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-sm font-semibold text-stone-700">{label}</legend>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex size-11 items-center justify-center rounded-md border border-stone-300 bg-white text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
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
          type="text"
          name="proposal_manual_bottle_name"
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
            name="proposal_box_condition"
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
            name="proposal_label_condition"
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
          type="url"
          inputMode="url"
          name="proposal_image_url"
          className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          placeholder="任意"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">備考</span>
        <textarea
          name="proposal_note"
          maxLength={1000}
          rows={3}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
          placeholder="例: どれか1本で相談したいです。まとめて希望なら条件を書いてください。"
        />
      </label>
    </fieldset>
  );
}
