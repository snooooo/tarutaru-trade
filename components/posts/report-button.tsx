"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { createReportAction, type ReportState } from "@/lib/actions/report-actions";

const initialState: ReportState = { status: "idle" };

export function ReportButton({
  postId,
  isLoggedIn,
  loginHref,
}: {
  postId: string;
  isLoggedIn: boolean;
  loginHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createReportAction, initialState);

  if (!isLoggedIn) {
    return (
      <a
        href={loginHref}
        className="flex w-full items-center justify-center gap-1.5 text-xs text-stone-400 transition hover:text-stone-600"
      >
        <Flag size={12} aria-hidden="true" />
        この投稿を通報する
      </a>
    );
  }

  if (state.status === "success") {
    return (
      <p className="text-center text-xs text-stone-500">通報を受け付けました。ご協力ありがとうございます。</p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 text-xs text-stone-400 transition hover:text-stone-600"
      >
        <Flag size={12} aria-hidden="true" />
        この投稿を通報する
      </button>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="trade_post_id" value={postId} />
      <label className="grid gap-1.5">
        <span className="text-xs font-medium text-stone-600">
          通報理由 <span className="font-normal text-stone-400">任意</span>
        </span>
        <textarea
          name="reason"
          rows={3}
          maxLength={500}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-stone-900"
          placeholder="偽物・詐欺疑いなど、気になった点をご記入ください"
        />
      </label>
      {state.status === "error" && (
        <p className="text-xs text-red-600">{state.message}</p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-700 px-3 text-xs font-semibold text-white transition hover:bg-red-800 disabled:opacity-50"
        >
          <Flag size={12} aria-hidden="true" />
          {pending ? "送信中…" : "通報する"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-8 items-center rounded-md border border-stone-300 px-3 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
