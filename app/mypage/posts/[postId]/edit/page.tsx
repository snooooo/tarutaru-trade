import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { TradePostForm } from "@/components/posts/trade-post-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getMyTradePost } from "@/lib/data/trade-posts";

type EditTradePostPageProps = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditTradePostPage({
  params,
  searchParams,
}: EditTradePostPageProps) {
  const { postId } = await params;
  const { error } = await searchParams;
  await requireCompleteTradeProfile(`/mypage/posts/${postId}/edit`);

  const result = await getMyTradePost(postId);
  const post = result.data[0];

  if (result.isConfigured && !result.error && !post) {
    notFound();
  }

  const canEdit = post?.status === "public" || post?.status === "private";

  return (
    <PageShell>
      <section className="mx-auto grid max-w-3xl gap-6">
        <Link
          href="/mypage"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          マイページに戻る
        </Link>

        <div>
          <p className="text-sm font-medium text-stone-500">Edit post</p>
          <h1 className="mt-1 text-3xl font-semibold">トレード投稿を編集</h1>
          <p className="mt-3 text-stone-700">
            相談開始前の公開中/非公開投稿だけ編集できます。相談中になった投稿は取引履歴として固定します。
          </p>
        </div>

        <DataStatusNote isConfigured={result.isConfigured} error={result.error} />

        {post && canEdit ? <TradePostForm post={post} error={error} /> : null}

        {post && !canEdit ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            相談中または終了済みのトレード投稿は編集できません。
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
