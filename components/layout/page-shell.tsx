import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  );
}
