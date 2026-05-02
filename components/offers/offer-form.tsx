import { BottleSearchField } from "@/components/bottles/bottle-search-field";
import { createOfferItemAction } from "@/lib/actions/trade-item-actions";
import { formatBoxCondition, formatLabelCondition } from "@/lib/format/trade";
import {
  BOX_CONDITIONS,
  LABEL_CONDITIONS,
} from "@/lib/validators/trade-items";

export function OfferForm() {
  return (
    <form
      action={createOfferItemAction}
      className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      <div className="grid gap-2">
        <span className="text-sm font-medium text-stone-700">
          MaltPeriボトル検索
        </span>
        <BottleSearchField />
      </div>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        手動ボトル名
        <input
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          maxLength={120}
          name="manual_bottle_name"
          placeholder="MaltPeriにない場合はこちらに入力"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          箱状態
          <select
            className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
            defaultValue="with_box_good"
            name="box_condition"
            required
          >
            {BOX_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {formatBoxCondition(condition)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-stone-700">
          ラベル状態
          <select
            className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
            defaultValue="good"
            name="label_condition"
            required
          >
            {LABEL_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {formatLabelCondition(condition)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        画像URL（任意）
        <input
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="image_url"
          placeholder="https://example.com/bottle.jpg"
          type="url"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        備考
        <textarea
          className="min-h-32 rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-950 outline-none transition focus:border-stone-950"
          maxLength={1000}
          name="note"
          placeholder="未開封、保管状態、気になる点など"
        />
      </label>

      <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
        出品として公開する
      </button>
    </form>
  );
}
