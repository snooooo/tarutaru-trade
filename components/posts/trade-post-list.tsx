import { ButtonLink } from "@/components/ui/button-link";
import { TradePostCard } from "@/components/posts/trade-post-card";
import type { PublicTradePost } from "@/lib/types/trade-posts";

export function TradePostList({
  posts,
  className = "grid gap-4 md:grid-cols-2",
}: {
  posts: PublicTradePost[];
  className?: string;
}) {
  if (!posts.length) {
    return (
      <div className="grid gap-4 rounded-md border border-dashed border-stone-300 bg-white/62 p-6 text-stone-700">
        <div>
          <h2 className="font-semibold text-stone-950">
            交換投稿はまだありません
          </h2>
          <p className="mt-1 text-sm">
            出る / 求むをまとめた投稿が公開されると、ここに表示されます。
          </p>
        </div>
        <ButtonLink href="/mypage/posts/new" className="w-full sm:w-fit">
          交換投稿を作る
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className={className}>
      {posts.map((post) => (
        <TradePostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
