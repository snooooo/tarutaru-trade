import { PageShell } from "@/components/layout/page-shell";
import { SearchForm } from "@/components/ui/search-form";
import { DataStatusNote } from "@/components/ui/status-note";
import { WantList } from "@/components/wants/want-list";
import { getPublicWants } from "@/lib/data/trade";

type WantsPageProps = {
  searchParams: Promise<{ q?: string; created?: string }>;
};

export default async function WantsPage({ searchParams }: WantsPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const wants = await getPublicWants({ query });

  return (
    <PageShell>
      <div className="grid gap-6">
        <div>
          <p className="text-sm font-medium text-stone-500">Wants</p>
          <h1 className="mt-1 text-3xl font-semibold">募集を探す</h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            欲しいボトルの公開一覧です。条件に合う出せるボトルがあれば興味ありへ進めます。
          </p>
        </div>
        <SearchForm
          action="/wants"
          placeholder="ボトル名・蒸留所・地域で検索"
          defaultValue={query}
        />
        <DataStatusNote isConfigured={wants.isConfigured} error={wants.error} />
        {params.created === "want" ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            募集を公開しました。一覧に反映されています。
          </p>
        ) : null}
        <WantList wants={wants.data} />
      </div>
    </PageShell>
  );
}
