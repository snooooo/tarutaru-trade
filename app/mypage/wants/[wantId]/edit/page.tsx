import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { DataStatusNote } from "@/components/ui/status-note";
import { WantEditForm } from "@/components/wants/want-edit-form";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getMyWantItem } from "@/lib/data/my-items";

type EditWantPageProps = {
  params: Promise<{ wantId: string }>;
  searchParams: Promise<{ updated?: string; error?: string }>;
};

const lockedStatusLabels: Record<string, string> = {
  trading: "この募集は進行中の取引に含まれているため、編集や取り下げはできません。",
  closed: "この募集は終了済みのため、編集や取り下げはできません。",
};

export default async function EditWantPage({
  params,
  searchParams,
}: EditWantPageProps) {
  const { wantId } = await params;
  const query = await searchParams;
  await requireCompleteTradeProfile(`/mypage/wants/${wantId}/edit`);
  const result = await getMyWantItem(wantId);

  if (!result.data && result.isConfigured) {
    notFound();
  }

  const item = result.data;
  const isEditable = item?.status === "public" || item?.status === "private";

  return (
    <PageShell>
      <section className="mx-auto grid max-w-3xl gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-500">Edit want</p>
            <h1 className="mt-1 text-3xl font-semibold">自分の募集を編集</h1>
            <p className="mt-3 text-stone-700">
              希望条件メモと公開状態を更新できます。進行中や終了済みの募集は保護されます。
            </p>
          </div>
          <ButtonLink href="/mypage" variant="secondary" className="gap-2">
            <ArrowLeft size={16} aria-hidden="true" />
            マイページ
          </ButtonLink>
        </div>

        <DataStatusNote
          isConfigured={result.isConfigured}
          error={result.error}
        />

        {query.updated === "want" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            募集を更新しました。
          </p>
        ) : null}
        {query.updated === "want_withdrawn" ? (
          <p className="rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
            募集を非公開にしました。
          </p>
        ) : null}
        {query.error ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {query.error}
          </p>
        ) : null}

        {item && isEditable ? <WantEditForm item={item} /> : null}

        {item && !isEditable ? (
          <div className="rounded-md border border-stone-200 bg-white/82 p-5 shadow-sm">
            <h2 className="font-semibold">
              {item.display_bottle_name ?? "この募集"}
            </h2>
            <p className="mt-2 text-sm text-stone-700">
              {lockedStatusLabels[item.status] ??
                "この状態の募集は編集や取り下げができません。"}
            </p>
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
