import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[430px] flex-1 px-4 py-6 lg:max-w-6xl lg:px-6 lg:py-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
