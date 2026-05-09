import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip">
      <Suspense>
        <SiteHeader />
      </Suspense>
      <main className="mx-auto w-full min-w-0 max-w-[430px] flex-1 px-4 py-6 lg:max-w-6xl lg:px-6 lg:py-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
