import { BottleSearchField } from "@/components/bottles/bottle-search-field";
import { createWantItemAction } from "@/lib/actions/trade-item-actions";

export function WantForm() {
  return (
    <form
      action={createWantItemAction}
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

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        希望条件メモ
        <textarea
          className="min-h-36 rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-950 outline-none transition focus:border-stone-950"
          maxLength={1000}
          name="condition_note"
          placeholder="箱あり希望、ラベル状態、交換で重視したい条件など"
        />
      </label>

      <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
        募集として公開する
      </button>
    </form>
  );
}
