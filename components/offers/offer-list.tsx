import { OfferCard } from "@/components/offers/offer-card";
import type { PublicOfferItem } from "@/lib/types/trade";

type OfferListProps = {
  offers: PublicOfferItem[];
  className?: string;
};

export function OfferList({ offers, className }: OfferListProps) {
  if (offers.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-300 bg-white/50 p-8 text-center text-stone-600">
        まだ公開中の出品はありません。
      </div>
    );
  }

  return (
    <div className={className ?? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
