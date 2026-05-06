import Link from "next/link";
import { upsertTradeProfileAction } from "@/lib/actions/profile-actions";
import type { TradeProfile } from "@/lib/types/profile";
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

      <label className="flex items-start gap-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
        <input
          className="mt-1 size-5"
          type="checkbox"
          name="anonymous_shipping_ok"
          defaultChecked={profile?.anonymous_shipping_ok ?? false}
        />
        <span>
          <span className="block font-medium text-stone-950">匿名配送OK</span>
          <span className="mt-1 block leading-6">
            相談開始後のやりとりで、匿名配送を使えることを相手に示します。
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
        <input
          className="mt-1 size-5"
          type="checkbox"
          name="terms_accepted"
          defaultChecked={Boolean(profile?.terms_accepted_at)}
        />
        <span>
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
            に同意
          </span>
          <span className="mt-1 block leading-6">
            掲載と興味ありへ進むには、X ID、フォロワー数レンジ、匿名配送可否とあわせて同意が必要です。
          </span>
        </span>
      </label>

      <button className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800">
        プロフィールを保存
      </button>
    </form>
  );
}
