import { PageShell } from "@/components/layout/page-shell";
import { TradePostList } from "@/components/posts/trade-post-list";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicTradePosts } from "@/lib/data/trade-posts";

type PostsPageProps = {
  searchParams: Promise<{ q?: string; created?: string }>;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const posts = await getPublicTradePosts({ query });

  return (
    <PageShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">Trade posts</p>
          <h1 className="mt-1 text-3xl font-semibold">交換投稿を探す</h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            「出る / 求む」が同じ投稿にまとまった公開一覧です。X IDは相談開始まで表示されません。
          </p>
        </div>
        <SearchForm
          action="/posts"
          placeholder="ボトル名・蒸留所・地域・条件で検索"
          defaultValue={query}
        />
        <DataStatusNote isConfigured={posts.isConfigured} error={posts.error} />
        {params.created === "post" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            交換投稿を公開しました。一覧に反映されています。
          </p>
        ) : null}
        <TradePostList posts={posts.data} />
      </div>
    </PageShell>
  );
}
