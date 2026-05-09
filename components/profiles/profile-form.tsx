"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { upsertTradeProfileAction } from "@/lib/actions/profile-actions";
import { PREFECTURES, type ShippingPreference, type TradeProfile } from "@/lib/types/profile";
import { formatProfileFollowersRange } from "@/lib/format/profile";
import { SubmitButton } from "@/components/ui/submit-button";

type ProfileFormProps = {
  profile: TradeProfile | null;
  nextPath: string;
};

const followerRanges = [
  "under_100",
  "100_499",
  "500_999",
] as const;


function XIdHelpPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* ポップアップ本体 */}
      <div className="absolute left-0 top-9 z-50 w-80 rounded-lg border border-stone-200 bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-base font-semibold text-stone-800">X ID の入力について</span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
        <ul className="grid gap-3 text-sm leading-6 text-stone-600">
          <li>
            <span className="font-medium text-stone-800">🔍 Xアプリでの確認手順</span>
            <p className="mt-1 text-xs text-stone-500">以下はXアプリ（旧Twitter）の操作です</p>
            <ol className="mt-1.5 grid gap-1.5 pl-4 list-decimal text-stone-600">
              <li>画面左上の<span className="font-medium text-stone-700">プロフィールアイコン</span>をタップ</li>
              <li>サイドメニューの<span className="font-medium text-stone-700">「設定とプライバシー」</span>をタップ<br/>
                <span className="text-xs text-stone-500">※「設定とサポート」の中にある場合があります</span>
              </li>
              <li><span className="font-medium text-stone-700">「アカウント」</span>をタップ</li>
              <li><span className="font-medium text-stone-700">「アカウント情報」</span>をタップ</li>
              <li><span className="font-medium text-stone-700">「ユーザー名」</span>に記載されている<br/>
                <code className="rounded bg-stone-100 px-1 py-0.5 text-stone-700">@</code> より後の部分がX IDです
              </li>
            </ol>
          </li>
          <li>
            <span className="font-medium text-stone-800">📌 @ は付けずに入力</span><br />
            <span className="text-stone-500">例：</span>
            <code className="rounded bg-stone-100 px-1 py-0.5 text-stone-700">tarutaru_whisky</code>
          </li>
          <li>
            <span className="font-medium text-stone-800">💬 何に使われますか？</span><br />
            トレードが成立すると、相手のX IDが開示されます。XのDMで連絡を取るために使います。
          </li>
        </ul>
      </div>
    </>
  );
}

export function ProfileForm({ profile, nextPath }: ProfileFormProps) {
  const searchParams = useSearchParams();
  const [showXIdHelp, setShowXIdHelp] = useState(false);
  const [showSaved, setShowSaved] = useState(
    () => searchParams.get("profile_saved") === "1",
  );
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("profile_saved") === "1") {
      // クエリパラメータを履歴から消す
      const url = new URL(window.location.href);
      url.searchParams.delete("profile_saved");
      router.replace(url.pathname + (url.search || ""), { scroll: false });
      // 4秒後にバナーを自動非表示
      const timer = setTimeout(() => setShowSaved(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <>
      {showSaved && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm animate-fade-in"
        >
          <svg
            className="size-5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          プロフィールを保存しました
        </div>
      )}
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

      <div className="grid gap-2">
        <div className="relative flex items-center gap-1.5">
          <span className="text-sm font-medium text-stone-700">X ID</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowXIdHelp((v) => !v)}
              className="flex size-7 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-sm font-bold text-stone-500 transition hover:border-stone-400 hover:bg-stone-200 hover:text-stone-700"
              aria-label="X IDの入力ガイドを表示"
            >
              ?
            </button>
            {showXIdHelp && <XIdHelpPopup onClose={() => setShowXIdHelp(false)} />}
          </div>
        </div>
        <input
          type="text"
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="x_id"
          placeholder="tarutaru_whisky（@なしで入力）"
          defaultValue={profile?.x_id ?? ""}
          maxLength={80}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

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

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        発送元の都道府県
        <select
          className="h-11 rounded-md border border-stone-300 bg-white px-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
          name="shipping_region"
          defaultValue={profile?.shipping_region ?? ""}
        >
          <option value="">未設定</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
        <span className="text-xs leading-5 text-stone-500">
          💡 トレード投稿の一覧カードに表示されます。送料の見込みを相手が判断しやすくなります。
        </span>
      </label>

      <fieldset className="grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3">
        <legend className="px-1 text-sm font-medium text-stone-950">配送時の住所等の開示</legend>
        <p className="px-1 text-xs leading-5 text-stone-500">
          X IDは相談開始後に相互開示されます。ここでは配送時に住所等を知らせるかどうかを設定します。匿名配送を使わない場合、氏名・住所・電話番号の開示が必要です。
        </p>
        {(
          [
            ["anonymous_only", "配送先住所等を知らせたくない", "匿名配送サービスのみで取引します。氏名・住所・電話番号は相手に伝わりません。"],
            ["negotiable", "相談して決めたい", "匿名配送でも住所等開示でも対応できます。相手と相談して決めます。"],
            ["disclose_preferred", "住所等を開示して取引したい", "匿名配送は使いません。氏名・住所・電話番号を相手に伝えて取引します。"],
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


      <SubmitButton pendingLabel="保存中…">プロフィールを保存</SubmitButton>
    </form>
    </>
  );
}
