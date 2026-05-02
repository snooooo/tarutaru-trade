import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { PostInterestCreateForm } from "@/components/posts/post-interest-create-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireCompleteTradeProfile } from "@/lib/auth/require-user";
import { getPublicTradePost } from "@/lib/data/trade-posts";

type PostInterestPageProps = {
  params: Promise<{ postId: string }>;
};

export default async function PostInterestPage({
  params,
}: PostInterestPageProps) {
  const { postId } = await params;
  const returnPath = `/posts/${postId}/interest`;
  await requireCompleteTradeProfile(returnPath);

  const postResult = await getPublicTradePost(postId);
  const post = postResult.data[0];

  if (postResult.isConfigured && !postResult.error && !post) {
    notFound();
  }

  return (
    <PageShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">Interest</p>
          <h1 className="mt-1 text-3xl font-semibold">トレードに興味あり</h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            相手の交換投稿に対して、この相談で自分が出せる候補を送ります。
          </p>
        </div>
        <DataStatusNote
          isConfigured={postResult.isConfigured}
          error={postResult.error}
        />
        {post ? (
          <PostInterestCreateForm
            post={post}
            returnPath={returnPath}
          />
        ) : null}
      </div>
    </PageShell>
  );
}
