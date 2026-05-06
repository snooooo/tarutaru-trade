import { Suspense } from "react";
import { Check, Plus, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { TradePostList } from "@/components/posts/trade-post-list";
import { ButtonLink } from "@/components/ui/button-link";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { getPublicTradePosts } from "@/lib/data/trade-posts";

async function NewPosts() {
  const posts = await getPublicTradePosts({ limit: 8 });
  return (
    <>
      <div className="grid gap-3">
        <DataStatusNote isConfigured={posts.isConfigured} error={posts.error} />
      </div>
      <div className="mt-9 grid gap-6">
        <section className="grid content-start gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-stone-500">
              New posts
            </p>
            <h2 className="mt-1 text-2xl font-bold">新着トレード投稿</h2>
          </div>
          <TradePostList posts={posts.data} />
          <div className="flex justify-center">
            <ButtonLink href="/posts" variant="ghost">
              すべて見る
            </ButtonLink>
          </div>
        </section>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <PageShell>
      <section className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:py-10">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white/86 px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm">
            <ShieldCheck size={16} aria-hidden="true" />
            powered by MaltPeri
          </p>
          <h1 className="text-[36px] font-bold leading-none tracking-normal text-stone-950 lg:text-5xl">
            TaruTaruTrade
          </h1>
          <div className="mt-5 grid max-w-xl gap-2 text-base leading-7 text-stone-700">
            <p className="flex gap-2">
              <Check
                className="mt-1 size-4 shrink-0 text-stone-950"
                aria-hidden="true"
              />
              <span>ウイスキートレードのための半匿名プラットフォーム。</span>
            </p>
            <p className="flex gap-2">
              <Check
                className="mt-1 size-4 shrink-0 text-stone-950"
                aria-hidden="true"
              />
              <span>募集は匿名OK。相談開始後にXアカウントを相互開示。</span>
            </p>
          </div>
        </div>
        <div className="rounded-md border border-stone-200 bg-white/86 p-4 shadow-sm">
          <SearchForm
            action="/posts"
            placeholder="ボトル名・蒸留所・地域・条件で検索"
            submitButton="always"
          />
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            <ButtonLink href="/posts" variant="secondary" className="gap-2">
              投稿一覧
            </ButtonLink>
            <ButtonLink href="/mypage/posts/new" className="gap-2">
              <Plus size={16} aria-hidden="true" />
              投稿を作る
            </ButtonLink>
          </div>
        </div>
      </section>
      <Suspense>
        <NewPosts />
      </Suspense>
    </PageShell>
  );
}
