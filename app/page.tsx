import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { TradePostList } from "@/components/posts/trade-post-list";
import { ButtonLink } from "@/components/ui/button-link";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicTradePosts } from "@/lib/data/trade-posts";

export default async function Home() {
  const posts = await getPublicTradePosts({ limit: 8 });

  return (
    <PageShell>
      <section className="grid gap-8 py-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 text-sm font-medium text-stone-700">
            <ShieldCheck size={16} aria-hidden="true" />
            powered by MaltPeri
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-6xl">
            TaruTaru Trade
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
            Xの「出る / 求む」交換投稿を整理して、相談開始後にX IDを相互開示。MaltPeriのボトル・相場データを使いながら、気軽にウイスキー交換のきっかけを探せます。
          </p>
        </div>
        <div className="rounded-md border border-stone-200 bg-white/75 p-4 shadow-sm">
          <SearchForm
            action="/posts"
            placeholder="ボトル名・蒸留所・地域・条件で検索"
          />
          <div className="mt-3 grid gap-2">
            <ButtonLink href="/posts" variant="secondary" className="gap-2">
              交換投稿を見る
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/mypage/posts/new" className="gap-2">
              交換投稿を作る
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        <DataStatusNote
          isConfigured={posts.isConfigured}
          error={posts.error}
        />
      </div>

      <div className="mt-10 grid gap-6">
        <section className="grid content-start gap-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-stone-500">New posts</p>
              <h2 className="text-2xl font-semibold">新着交換投稿</h2>
            </div>
            <ButtonLink href="/posts" variant="ghost">
              すべて見る
            </ButtonLink>
          </div>
          <TradePostList posts={posts.data} />
        </section>
      </div>
    </PageShell>
  );
}
