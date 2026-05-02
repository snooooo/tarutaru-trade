import Link from "next/link";
import {
  Barrel,
  LogIn,
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
    <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f7f4ed]/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-stone-950 text-white">
            <Barrel size={20} aria-hidden="true" />
          </span>
          <span className="whitespace-nowrap">TaruTaru Trade</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <ButtonLink href="/offers" variant="ghost">
            出品を探す
          </ButtonLink>
          <ButtonLink href="/wants" variant="ghost">
            募集を探す
          </ButtonLink>
          {user ? (
            <ButtonLink href="/mypage" variant="ghost">
              マイページ
            </ButtonLink>
          ) : null}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/offers" variant="secondary" className="gap-2">
            <Search size={16} aria-hidden="true" />
            探す
          </ButtonLink>
          {user ? (
            <>
              <ButtonLink
                href="/mypage"
                variant="secondary"
                className="px-3 sm:hidden"
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
                href="/mypage/offers/new"
                className="hidden gap-2 lg:flex"
              >
                <PlusCircle size={16} aria-hidden="true" />
                登録
              </ButtonLink>
              <ButtonLink
                href="/settings/profile"
                variant="ghost"
                className="hidden gap-2 lg:flex"
              >
                <Settings size={16} aria-hidden="true" />
                プロフィール
              </ButtonLink>
              <form action={logoutAction}>
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
              <ButtonLink
                href="/login"
                variant="secondary"
                className="px-3 sm:hidden"
                aria-label="ログイン"
                title="ログイン"
              >
                <LogIn size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/login" variant="ghost" className="hidden sm:flex">
                ログイン
              </ButtonLink>
              <ButtonLink href="/signup" className="hidden gap-2 sm:flex">
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
