import {
  updateOfferItemAction,
  withdrawOfferItemAction,
} from "@/lib/actions/trade-item-actions";
import {
  bottleSubline,
  formatBoxCondition,
  formatDate,
  formatLabelCondition,
} from "@/lib/format/trade";
import type { ManagedOfferItem } from "@/lib/data/my-items";
import {
  BOX_CONDITIONS,
  LABEL_CONDITIONS,
} from "@/lib/validators/trade-items";

const editableStatuses = [
  { value: "public", label: "公開中" },
  { value: "private", label: "非公開・受付停止" },
] as const;

export function OfferEditForm({ item }: { item: ManagedOfferItem }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm">
        <p className="text-xs font-medium text-stone-500">
          {formatDate(item.created_at)}
        </p>
        <h2 className="mt-1 text-xl font-semibold">
          {item.display_bottle_name ?? "名称未設定のボトル"}
        </h2>
        {bottleSubline({
          brand_name: item.brand_name,
          country: item.country,
          distillery_area: null,
          distillery_name_ja: item.distillery_name_ja,
        }) ? (
          <p className="mt-1 text-sm text-stone-600">
            {bottleSubline({
              brand_name: item.brand_name,
              country: item.country,
              distillery_area: null,
              distillery_name_ja: item.distillery_name_ja,
            })}
          </p>
        ) : null}
      </div>

      <form
        action={updateOfferItemAction}
        className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
      >
        <input name="offer_id" type="hidden" value={item.id} />

        <label className="grid gap-2 text-sm font-medium text-stone-700">
          公開状態
          <select
            className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
            defaultValue={item.status}
            name="status"
            required
          >
            {editableStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            箱状態
            <select
              className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
              defaultValue={item.box_condition}
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
              defaultValue={item.label_condition}
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
            defaultValue={item.image_url ?? ""}
            name="image_url"
            placeholder="https://example.com/bottle.jpg"
            type="url"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-stone-700">
          備考
          <textarea
            className="min-h-32 rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-950 outline-none transition focus:border-stone-950"
            defaultValue={item.note ?? ""}
            maxLength={1000}
            name="note"
            placeholder="未開封、保管状態、気になる点など"
          />
        </label>

        <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          変更を保存
        </button>
      </form>

      <form
        action={withdrawOfferItemAction}
        className="rounded-md border border-stone-200 bg-white/70 p-5"
      >
        <input name="offer_id" type="hidden" value={item.id} />
        <input
          name="redirect_to"
          type="hidden"
          value={`/mypage/offers/${item.id}/edit`}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">出品を取り下げる</h2>
            <p className="mt-1 text-sm text-stone-600">
              非公開にして、旧互換の興味あり受付から外します。
            </p>
          </div>
          <button className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-950 transition hover:bg-stone-50">
            非公開にする
          </button>
        </div>
      </form>
    </div>
  );
}
