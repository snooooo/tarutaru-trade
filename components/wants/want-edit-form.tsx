import {
  updateWantItemAction,
  withdrawWantItemAction,
} from "@/lib/actions/trade-item-actions";
import { bottleSubline, formatDate } from "@/lib/format/trade";
import type { ManagedWantItem } from "@/lib/data/my-items";

const editableStatuses = [
  { value: "public", label: "公開中" },
  { value: "private", label: "非公開・受付停止" },
] as const;

export function WantEditForm({ item }: { item: ManagedWantItem }) {
  const subline = bottleSubline({
    brand_name: item.brand_name,
    country: item.country,
    distillery_area: null,
    distillery_name_ja: item.distillery_name_ja,
  });

  return (
    <div className="grid gap-5">
      <div className="rounded-md border border-stone-200 bg-white/82 p-4 shadow-sm">
        <p className="text-xs font-medium text-stone-500">
          {formatDate(item.created_at)}
        </p>
        <h2 className="mt-1 text-xl font-semibold">
          {item.display_bottle_name ?? "名称未設定のボトル"}
        </h2>
        {subline ? <p className="mt-1 text-sm text-stone-600">{subline}</p> : null}
      </div>

      <form
        action={updateWantItemAction}
        className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
      >
        <input name="want_id" type="hidden" value={item.id} />

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

        <label className="grid gap-2 text-sm font-medium text-stone-700">
          希望条件メモ
          <textarea
            className="min-h-36 rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-950 outline-none transition focus:border-stone-950"
            defaultValue={item.condition_note ?? ""}
            maxLength={1000}
            name="condition_note"
            placeholder="箱あり希望、ラベル状態、交換で重視したい条件など"
          />
        </label>

        <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          変更を保存
        </button>
      </form>

      <form
        action={withdrawWantItemAction}
        className="rounded-md border border-stone-200 bg-white/70 p-5"
      >
        <input name="want_id" type="hidden" value={item.id} />
        <input
          name="redirect_to"
          type="hidden"
          value={`/mypage/wants/${item.id}/edit`}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">募集を取り下げる</h2>
            <p className="mt-1 text-sm text-stone-600">
              非公開にして、募集一覧と新しい興味あり受付から外します。
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
