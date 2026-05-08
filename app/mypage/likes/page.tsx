import { Heart } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { PaginatedTradePostList } from "@/components/posts/paginated-trade-post-list";
import { DataStatusNote } from "@/components/ui/status-note";
import { requireUser } from "@/lib/auth/require-user";
import {
  getLikeCountsByPostIds,
  getMyLikedPostIdSet,
  getMyLikedTradePosts,
} from "@/lib/data/likes";

export default async function MyLikesPage() {
  await requireUser("/mypage/likes");
  const result = await getMyLikedTradePosts();

  const postIds = result.data.map((p) => p.id);
  const [countsMap, likedSet] = await Promise.all([
    getLikeCountsByPostIds(postIds),
    getMyLikedPostIdSet(postIds),
  ]);
  const likeCounts: Record<string, number> = {};
  for (const [id, n] of countsMap) likeCounts[id] = n;

  return (
    <PageShell>
      <BackButton fallbackHref="/mypage" />
      <section className="mt-2 grid gap-6">
        <header>
          <p className="text-sm font-medium text-stone-500">My likes</p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-semibold sm:text-3xl">
            <Heart size={22} aria-hidden="true" className="fill-rose-500 text-rose-500" />
            いいねした投稿
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            いいねを押した投稿が新しい順に並びます。取引終了後の投稿は匿名化されて表示されます。
          </p>
        </header>

        <DataStatusNote isConfigured={result.isConfigured} error={result.error} />

        {result.data.length ? (
          <PaginatedTradePostList
            posts={result.data}
            likeCounts={likeCounts}
            likedPostIds={Array.from(likedSet)}
          />
        ) : (
          <div className="rounded-md border border-dashed border-stone-300 bg-white/62 p-6">
            <h2 className="font-semibold text-stone-950">
              いいねした投稿はまだありません
            </h2>
            <p className="mt-1 text-sm text-stone-700">
              一覧で気になる投稿のハートを押すと、ここに表示されます。
            </p>
            <ButtonLink href="/posts" variant="secondary" className="mt-4 gap-2">
              トレード投稿を探す
            </ButtonLink>
          </div>
        )}
      </section>
    </PageShell>
  );
}
