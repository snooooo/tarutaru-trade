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

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f7f4ed]/94 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[430px] items-center justify-between gap-2 px-4 lg:h-16 lg:max-w-6xl lg:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 font-semibold"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-stone-950 text-white">
            <Barrel size={19} aria-hidden="true" />
          </span>
          <span className="truncate whitespace-nowrap">TaruTaru Trade</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <ButtonLink href="/posts" variant="ghost">
            交換投稿を探す
          </ButtonLink>
          {user ? (
            <ButtonLink href="/mypage" variant="ghost">
              マイページ
            </ButtonLink>
          ) : null}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
          <Link
            href="/posts"
            className="inline-flex size-10 items-center justify-center rounded-md border border-stone-300 bg-white/80 text-stone-950 transition hover:bg-white lg:h-11 lg:w-auto lg:gap-2 lg:px-3 lg:text-sm lg:font-semibold"
            aria-label="投稿を探す"
            title="投稿を探す"
          >
            <Search size={18} strokeWidth={2.2} aria-hidden="true" />
            <span className="hidden lg:inline">探す</span>
          </Link>
          {user ? (
            <>
              <ButtonLink
                href="/mypage"
                variant="secondary"
                className="size-10 px-0 lg:hidden"
                aria-label="マイページ"
                title="マイページ"
              >
                <UserRound size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href="/mypage"
                variant="secondary"
                className="hidden gap-2 sm:flex lg:hidden"
              >
                マイページ
              </ButtonLink>
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
                className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 bg-white/80 px-4 text-sm font-bold leading-none text-stone-950 transition hover:bg-white lg:hidden"
              >
                ログイン
              </Link>
              <ButtonLink href="/login" variant="ghost" className="hidden lg:flex">
                ログイン
              </ButtonLink>
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-bold leading-none text-white transition hover:bg-stone-800 lg:hidden"
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
