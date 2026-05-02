import { WantCard } from "@/components/wants/want-card";
import type { PublicWantItem } from "@/lib/types/trade";

type WantListProps = {
  wants: PublicWantItem[];
  className?: string;
};

export function WantList({ wants, className }: WantListProps) {
  if (wants.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-300 bg-white/50 p-8 text-center text-stone-600">
        まだ公開中の募集はありません。
      </div>
    );
  }

  return (
    <div className={className ?? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
      {wants.map((want) => (
        <WantCard key={want.id} want={want} />
      ))}
    </div>
  );
}
