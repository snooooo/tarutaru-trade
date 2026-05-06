/**
 * ヤフオク落札相場検索URLを生成する。
 * ボトル名が無い場合は null を返す。
 */
export function buildYahooAuctionSearchUrl(
  bottleName: string | null | undefined,
): string | null {
  if (!bottleName) return null;

  const params = new URLSearchParams({
    p: bottleName,
    b: "1",
    n: "50",
    select: "6", // 落札済み
    mode: "3", // 新しい順
    dest_pref_code: "23",
  });

  return `https://auctions.yahoo.co.jp/closedsearch/closedsearch?${params.toString()}`;
}
