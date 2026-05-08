import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { PaginatedTradePostList } from "@/components/posts/paginated-trade-post-list";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import {
  getLikeCountsByPostIds,
  getMyLikedPostIdSet,
} from "@/lib/data/likes";
import { getPublicTradePosts } from "@/lib/data/trade-posts";

type SearchParams = { q?: string; created?: string };

async function PostsList({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<SearchParams>;
}) {
  const params = await searchParamsPromise;
  const query = params.q ?? "";
  const posts = await getPublicTradePosts({ query });
  const postIds = posts.data.map((p) => p.id);
  const [likeCountsMap, likedSet] = await Promise.all([
    getLikeCountsByPostIds(postIds),
    getMyLikedPostIdSet(postIds),
  ]);
  const likeCounts: Record<string, number> = {};
  for (const [id, n] of likeCountsMap) likeCounts[id] = n;
  return (
    <>
      <SearchForm
        action="/posts"
        placeholder="ボトル名・蒸留所・地域・条件で検索"
        defaultValue={query}
      />
      <DataStatusNote isConfigured={posts.isConfigured} error={posts.error} />
      {params.created === "post" ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          トレード投稿を公開しました。一覧に反映されています。
        </p>
      ) : null}
      <PaginatedTradePostList
        posts={posts.data}
        likeCounts={likeCounts}
        likedPostIds={Array.from(likedSet)}
      />
    </>
  );
}

export default function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <PageShell>
      <div className="grid gap-5 sm:gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-stone-500">
            Trade posts
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            トレード投稿を探す
          </h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            「出 / 求」が同じ投稿にまとまった公開一覧です。X IDは相談開始まで表示されません。
          </p>
        </div>
        <Suspense>
          <PostsList searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </PageShell>
  );
}
