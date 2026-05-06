import { ExternalLink } from "lucide-react";
import { buildYahooAuctionSearchUrl } from "@/lib/format/yahoo-auction";

/**
 * ボトル名からヤフオク落札相場の検索結果ページへのリンクを表示する。
 * ボトル名が無い場合は何もレンダリングしない。
 */
export function YahooAuctionLink({
  bottleName,
}: {
  bottleName: string | null | undefined;
}) {
  const url = buildYahooAuctionSearchUrl(bottleName);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
    >
      ヤフオク落札相場
      <ExternalLink size={12} aria-hidden="true" />
    </a>
  );
}
