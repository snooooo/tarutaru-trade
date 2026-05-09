"use client";

import { type FormEvent, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Minus, Plus } from "lucide-react";
import {
  createTradePostAction,
  updateTradePostAction,
} from "@/lib/actions/trade-post-actions";
import { YahooAuctionLink } from "@/components/ui/yahoo-auction-link";
import type { MyTradePost } from "@/lib/types/trade-posts";

const MAX_ITEMS = 3;

type TradePostFormProps = {
  error?: string;
  post?: MyTradePost;
};

export function TradePostForm({ error, post }: TradePostFormProps) {
  const editableOffers = post?.offer_items.filter((item) => item.status !== "private") ?? [];
  const editableWants = post?.want_items.filter((item) => item.status !== "private") ?? [];
  const [offerCount, setOfferCount] = useState(
    Math.min(Math.max(editableOffers.length, 1), MAX_ITEMS),
  );
  const [wantCount, setWantCount] = useState(
    Math.min(Math.max(editableWants.length, 1), MAX_ITEMS),
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const isEdit = Boolean(post);
  const displayError = clientError ?? error;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const hasOfferBottle = formData
      .getAll("offer_manual_bottle_name")
      .some((value) => typeof value === "string" && value.trim());

    if (!hasOfferBottle) {
      event.preventDefault();
      setClientError("出のボトル名を1件以上入力してください。");
      event.currentTarget
        .querySelector<HTMLInputElement>('input[name="offer_manual_bottle_name"]')
        ?.focus();
      return;
    }

    setClientError(null);
  }

  return (
    <form
      action={isEdit ? updateTradePostAction : createTradePostAction}
      noValidate
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      {post ? <input type="hidden" name="trade_post_id" value={post.id} /> : null}

      {displayError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {displayError}
        </p>
      ) : null}

      <section className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">投稿全体</h2>
          <p className="mt-1 text-sm text-stone-600">
            出 / 求だけでは伝わりにくい条件があれば、補足にまとめてください。
          </p>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">補足条件</span>
          <textarea
            name="condition_note"
            maxLength={1000}
            rows={4}
            defaultValue={post?.condition_note ?? ""}
            className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
            placeholder={
              "例:\n出の候補はどれか1本で相談したいです。\n2本まとめてなら◯◯希望です。\n求の候補以外でも近い価格帯なら相談したいです。\n都内手渡し優先です。"
            }
          />
        </label>
      </section>

      <section className="grid gap-4 border-t border-stone-100 pt-5">
        <div>
          <h2 className="text-xl font-semibold">出</h2>
          <p className="mt-1 text-sm text-stone-600">
            トレードに出せる候補を最大3件までまとめられます。どれか1本か、まとめて希望かは補足条件に書いてください。1件目は必須です。
          </p>
        </div>
        {Array.from({ length: offerCount }, (_, index) => (
          <OfferFields
            key={index}
            index={index}
            item={editableOffers[index]}
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
            出の候補を追加
          </button>
        ) : null}
      </section>

      <section className="grid gap-4 border-t border-stone-100 pt-5">
        <div>
          <h2 className="text-xl font-semibold">求</h2>
          <p className="mt-1 text-sm text-stone-600">
            欲しい候補を最大3件まで書けます。未指定にすると提案歓迎として表示されます。
          </p>
        </div>
        {Array.from({ length: wantCount }, (_, index) => (
          <WantFields
            key={index}
            index={index}
            item={editableWants[index]}
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
            求の候補を追加
          </button>
        ) : null}
      </section>

      <div className="flex justify-end border-t border-stone-100 pt-5">
        <div className="grid w-full gap-3 sm:w-auto">
          {displayError ? (
            <p className="text-sm font-medium text-red-700">{displayError}</p>
          ) : null}
          <SubmitButton isEdit={isEdit} />
        </div>
      </div>
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-wait disabled:bg-stone-400"
    >
      {pending
        ? isEdit
          ? "保存中"
          : "公開中"
        : isEdit
          ? "トレード投稿を保存"
          : "トレード投稿を公開"}
      <ArrowRight size={16} aria-hidden="true" />
    </button>
  );
}

function OfferFields({
  index,
  item,
  required = false,
  onRemove,
}: {
  index: number;
  item?: MyTradePost["offer_items"][number];
  required?: boolean;
  onRemove?: () => void;
}) {
  const label = `出 ${index + 1}`;
  const initialName = item?.manual_bottle_name ?? item?.display_bottle_name ?? "";
  const [bottleName, setBottleName] = useState(initialName);

  return (
    <fieldset className="grid gap-4 rounded-md border border-stone-200 bg-stone-50/60 p-4">
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
      <input type="hidden" name="offer_item_id" value={item?.id ?? ""} />
      <div className="grid gap-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">ボトル名</span>
          <input
            type="text"
            name="offer_manual_bottle_name"
            aria-required={required}
            maxLength={120}
            defaultValue={initialName}
            onChange={(e) => setBottleName(e.target.value)}
            className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
            placeholder={required ? "例: グレンリベット12年" : "任意"}
          />
        </label>
        {bottleName.trim() ? (
          <YahooAuctionLink bottleName={bottleName.trim()} />
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">箱状態</span>
          <select
            name="box_condition"
            defaultValue={item?.box_condition ?? "with_box_good"}
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
            defaultValue={item?.label_condition ?? "good"}
            className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
          >
            <option value="good">良好</option>
            <option value="minor_damage">軽い傷み</option>
            <option value="damaged">傷みあり</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">備考</span>
        <textarea
          name="offer_note"
          maxLength={1000}
          rows={3}
          defaultValue={item?.note ?? ""}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
          placeholder="任意"
        />
      </label>
    </fieldset>
  );
}

function WantFields({
  index,
  item,
  onRemove,
}: {
  index: number;
  item?: MyTradePost["want_items"][number];
  onRemove?: () => void;
}) {
  const label = `求 ${index + 1}`;
  const initialName = item?.manual_bottle_name ?? item?.display_bottle_name ?? "";
  const [bottleName, setBottleName] = useState(initialName);

  return (
    <fieldset className="grid gap-4 rounded-md border border-stone-200 bg-stone-50/60 p-4">
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
      <input type="hidden" name="want_item_id" value={item?.id ?? ""} />
      <div className="grid gap-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">ボトル名</span>
          <input
            type="text"
            name="want_manual_bottle_name"
            maxLength={120}
            defaultValue={initialName}
            onChange={(e) => setBottleName(e.target.value)}
            className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none transition focus:border-stone-950"
            placeholder={index === 0 ? "例: グレンフィディック15年" : "任意"}
          />
        </label>
        {bottleName.trim() ? (
          <YahooAuctionLink bottleName={bottleName.trim()} />
        ) : null}
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">希望条件</span>
        <textarea
          name="want_condition_note"
          maxLength={1000}
          rows={3}
          defaultValue={item?.condition_note ?? ""}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-950"
          placeholder="任意"
        />
      </label>
    </fieldset>
  );
}
