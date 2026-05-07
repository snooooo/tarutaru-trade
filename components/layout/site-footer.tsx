import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200/80 bg-[#f7f4ed]/60">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-3 px-4 py-6 text-xs text-stone-600 sm:flex-row sm:items-center sm:justify-between lg:max-w-6xl lg:px-6 lg:py-8">
        <p>© TaruTaruTrade</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/terms" className="hover:text-stone-950 hover:underline underline-offset-4">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-stone-950 hover:underline underline-offset-4">
            プライバシーポリシー
          </Link>
          <Link href="/contact" className="hover:text-stone-950 hover:underline underline-offset-4">
            お問い合わせ
          </Link>
          <span>
            powered by{" "}
            <a
              href="https://maltperi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              MaltPeri
            </a>
          </span>
        </nav>
      </div>
    </footer>
  );
}
