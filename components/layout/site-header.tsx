import Link from "next/link";
import {
  Barrel,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { ButtonLink } from "@/components/ui/button-link";
import { getCurrentUser } from "@/lib/auth/require-user";
import { getPendingActionCount } from "@/lib/data/interests";

function PendingActionBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      aria-label={`対応待ち ${count}件`}
      className="pointer-events-none absolute -top-1 -right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-[#f7f4ed]"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export async function SiteHeader() {
  const user = await getCurrentUser();
  const pendingCount = user ? await getPendingActionCount() : 0;

  return (
    <header className="sticky top-0 z-20 w-full border-b border-stone-200/80 bg-[#f7f4ed]/94 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[430px] items-center justify-between gap-2 px-4 lg:h-16 lg:max-w-6xl lg:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 font-semibold"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-stone-950 text-white">
            <Barrel size={19} aria-hidden="true" />
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            TaruTaruTrade
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-800">
              BETA
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <ButtonLink href="/posts" variant="ghost">
            トレード投稿を探す
          </ButtonLink>
          {user ? (
            <span className="relative inline-flex">
              <ButtonLink href="/mypage" variant="ghost">
                マイページ
              </ButtonLink>
              <PendingActionBadge count={pendingCount} />
            </span>
          ) : null}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
          <Link
            href="/posts"
            className="hidden items-center justify-center rounded-md border border-stone-300 bg-white/80 text-stone-950 transition hover:bg-white lg:inline-flex lg:h-11 lg:w-auto lg:gap-2 lg:px-3 lg:text-sm lg:font-semibold"
            aria-label="投稿を探す"
            title="投稿を探す"
          >
            <Search size={18} strokeWidth={2.2} aria-hidden="true" />
            <span className="hidden lg:inline">探す</span>
          </Link>
          {user ? (
            <>
              <span className="relative inline-flex lg:hidden">
                <ButtonLink
                  href="/mypage"
                  variant="secondary"
                  className="inline-flex size-14 px-0"
                  aria-label="マイページ"
                  title="マイページ"
                >
                  <UserRound size={56} aria-hidden="true" />
                </ButtonLink>
                <PendingActionBadge count={pendingCount} />
              </span>
              <span className="relative hidden sm:inline-flex lg:hidden">
                <ButtonLink
                  href="/mypage"
                  variant="secondary"
                  className="gap-2"
                >
                  マイページ
                </ButtonLink>
                <PendingActionBadge count={pendingCount} />
              </span>
              <ButtonLink
                href="/mypage/posts/new"
                className="hidden gap-2 lg:flex"
              >
                <PlusCircle size={16} aria-hidden="true" />
                投稿
              </ButtonLink>
              <ButtonLink
                href="/settings/profile"
                variant="ghost"
                className="hidden gap-2 lg:flex"
              >
                <Settings size={16} aria-hidden="true" />
                プロフィール
              </ButtonLink>
              <form action={logoutAction} className="hidden lg:block">
                <button
                  className="inline-flex h-11 items-center justify-center rounded-md px-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-200/70"
                  title="ログアウト"
                >
                  <LogOut size={17} aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center px-3 text-sm font-semibold text-stone-700 transition hover:text-stone-950 lg:hidden"
              >
                ログイン
              </Link>
              <ButtonLink href="/login" variant="ghost" className="hidden lg:flex">
                ログイン
              </ButtonLink>
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-bold leading-none text-white transition hover:bg-stone-800 lg:hidden"
              >
                登録
              </Link>
              <ButtonLink href="/signup" className="hidden gap-2 lg:flex">
                <UserRound size={16} aria-hidden="true" />
                新規登録
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
