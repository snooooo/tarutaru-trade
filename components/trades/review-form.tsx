import { Star } from "lucide-react";
import { createTradeReviewAction } from "@/lib/actions/interest-actions";
import type { TradeInterestDetailItem } from "@/lib/types/interests";

export function ReviewForm({ trade }: { trade: TradeInterestDetailItem }) {
  return (
    <form
      action={createTradeReviewAction}
      className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      <input type="hidden" name="interest_id" value={trade.id} />

      <div>
        <p className="text-sm font-medium text-stone-500">Review</p>
        <h1 className="mt-1 text-3xl font-semibold">取引を評価する</h1>
        <p className="mt-3 max-w-2xl text-stone-700">
          相手への星評価を登録します。コメントはMVPでは公開表示しません。
        </p>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-stone-800">評価</legend>
        <div className="grid gap-2 sm:grid-cols-5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label
              key={rating}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-stone-300 bg-white/70 px-3 py-3 text-sm font-semibold transition hover:bg-white"
            >
              <input
                className="size-4 accent-stone-950"
                type="radio"
                name="rating"
                value={rating}
                required
              />
              <Star size={16} aria-hidden="true" />
              {rating}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-stone-800">コメント 任意</span>
        <textarea
          name="comment"
          rows={5}
          maxLength={1000}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-900"
          placeholder="取引メモや相手へのフィードバック"
        />
      </label>

      <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 sm:w-auto">
        <Star size={16} aria-hidden="true" />
        評価を登録する
      </button>
    </form>
  );
}
