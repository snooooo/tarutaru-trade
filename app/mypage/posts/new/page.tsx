import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { TradePostForm } from "@/components/posts/trade-post-form";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";

type NewTradePostPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewTradePostPage({
  searchParams,
}: NewTradePostPageProps) {
  const params = await searchParams;
  await requireCompleteTradeProfile("/mypage/posts/new");

  return (
    <PageShell>
      <div className="grid gap-6">
        <Link
          href="/mypage"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          マイページに戻る
        </Link>
        <div>
          <p className="text-sm font-medium text-stone-500">New trade post</p>
          <h1 className="mt-1 text-3xl font-semibold">トレード投稿を作る</h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            「出る」と「求む」を1つの投稿として公開します。X IDは相談開始まで表示されません。
          </p>
        </div>
        <TradePostForm error={params.error} />
      </div>
    </PageShell>
  );
}
