import { ArrowRight, PlusCircle } from "lucide-react";
import { createInterestAction } from "@/lib/actions/interest-actions";
import {
  bottleSubline,
  formatBoxCondition,
  formatLabelCondition,
  formatPrice,
} from "@/lib/format/trade";
import type {
  InterestTargetType,
  TradeBottleSummary,
} from "@/lib/types/interests";
import { ButtonLink } from "@/components/ui/button-link";

type InterestCreateFormProps = {
  targetType: InterestTargetType;
  targetId: string;
  returnPath: string;
  offerItems: TradeBottleSummary[];
};

export function InterestCreateForm({
  targetType,
  targetId,
  returnPath,
  offerItems,
}: InterestCreateFormProps) {
  if (!offerItems.length) {
    return (
      <section className="grid gap-4 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">交換候補のボトルがありません</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            興味ありを送るには、自分が出せるボトルを1本以上登録してください。
          </p>
        </div>
        <ButtonLink href="/mypage/offers/new" className="gap-2">
          <PlusCircle size={16} aria-hidden="true" />
          出せるボトルを登録
        </ButtonLink>
      </section>
    );
  }

  return (
    <form
      action={createInterestAction}
      className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="return_path" value={returnPath} />

      <div>
        <h2 className="text-lg font-semibold">交換候補として出せるボトル</h2>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          相手に見せる候補を1本選んでください。自由記述メッセージとX IDは送信されません。
        </p>
      </div>

      <div className="grid gap-3">
        {offerItems.map((item, index) => (
          <label
            key={item.id}
            className="grid cursor-pointer gap-3 rounded-md border border-stone-200 bg-stone-50/70 p-4 transition hover:border-stone-400 has-[:checked]:border-stone-950 has-[:checked]:bg-white"
          >
            <span className="flex items-start gap-3">
              <input
                className="mt-1 size-4 accent-stone-950"
                defaultChecked={index === 0}
                name="proposed_offer_item_id"
                required
                type="radio"
                value={item.id}
              />
              <span className="min-w-0">
                <span className="block font-semibold">
                  {item.display_bottle_name ?? "名称未設定のボトル"}
                </span>
                <span className="mt-1 block text-sm text-stone-600">
                  {bottleSubline(item) || "MaltPeri情報なし"}
                </span>
              </span>
            </span>
            <span className="flex flex-wrap gap-2 pl-7 text-xs text-stone-700">
              <span className="rounded bg-white px-2 py-1">
                {formatBoxCondition(item.box_condition)}
              </span>
              <span className="rounded bg-white px-2 py-1">
                ラベル {formatLabelCondition(item.label_condition)}
              </span>
              <span className="rounded bg-white px-2 py-1">
                {formatPrice(item.median_price)}
              </span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <ButtonLink href="/mypage/offers/new" variant="secondary" className="gap-2">
          <PlusCircle size={16} aria-hidden="true" />
          出せるボトルを追加
        </ButtonLink>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
          トレードに興味ありを送る
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
