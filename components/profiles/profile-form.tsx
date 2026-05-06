import Link from "next/link";
import { upsertTradeProfileAction } from "@/lib/actions/profile-actions";
import type { ShippingPreference, TradeProfile } from "@/lib/types/profile";
import { formatProfileFollowersRange } from "@/lib/format/profile";

type ProfileFormProps = {
  profile: TradeProfile | null;
  nextPath: string;
};

const followerRanges = [
  "under_100",
  "100_499",
  "500_999",
] as const;

export function ProfileForm({ profile, nextPath }: ProfileFormProps) {
  return (
    <form
      action={upsertTradeProfileAction}
      className="grid gap-5 rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm"
    >
      <input type="hidden" name="next" value={nextPath} />
      <label className="grid gap-2 text-sm font-medium text-stone-700">
        表示名
        <input
          type="text"
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="display_name"
          defaultValue={profile?.display_name ?? "ななしさん"}
          maxLength={40}
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        X ID
        <input
          type="text"
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="x_id"
          placeholder="tarutaru_whisky"
          defaultValue={profile?.x_id ?? ""}
          maxLength={80}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        フォロワー数レンジ
        <select
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="x_followers_range"
          defaultValue={profile?.x_followers_range ?? ""}
        >
          <option value="">未設定</option>
          {followerRanges.map((range) => (
            <option key={range} value={range}>
              {formatProfileFollowersRange(range)}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3">
        <legend className="px-1 text-sm font-medium text-stone-950">配送方法の希望</legend>
        {(
          [
            ["anonymous_only", "匿名配送のみ希望", "住所を相手に知られたくない方向けです。"],
            ["negotiable", "相談して決めたい", "どちらでもよい場合や、相手に合わせたい場合。"],
            ["disclose_preferred", "氏名・住所を開示して取引希望", "匿名配送を使わず、直接やりとりしたい方向けです。"],
          ] as [ShippingPreference, string, string][]
        ).map(([value, label, description]) => (
          <label key={value} className="flex items-start gap-3 py-1 text-sm text-stone-700 cursor-pointer">
            <input
              className="mt-0.5 size-4 accent-stone-950"
              type="radio"
              name="shipping_preference"
              value={value}
              defaultChecked={profile?.shipping_preference === value}
            />
            <span>
              <span className="block font-medium text-stone-950">{label}</span>
              <span className="block leading-6 text-stone-600">{description}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
        <span className="block font-medium text-stone-950">
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-stone-700"
          >
            利用規約
          </Link>
          および
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-stone-700"
          >
            プライバシーポリシー
          </Link>
        </span>
        <span className="mt-1 block leading-6">
          {profile?.terms_accepted_at
            ? `同意済み (${new Date(profile.terms_accepted_at).toLocaleDateString("ja-JP")})`
            : "未同意"}
        </span>
      </div>

      <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
        プロフィールを保存
      </button>
    </form>
  );
}
