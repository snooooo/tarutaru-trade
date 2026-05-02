import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[430px] px-4 py-6 lg:max-w-6xl lg:px-6 lg:py-10">
        {children}
      </main>
    </>
  );
}
