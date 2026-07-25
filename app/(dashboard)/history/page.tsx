import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HistoryList } from "@/components/history/HistoryList";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";

export const revalidate = 0;

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Ad banner */}
      <AdBanner slot="history-top" className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main history layout */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Rewrite History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search, view, download, or manage all your past humanized translations.
            </p>
          </div>

          <HistoryList />
        </div>

        {/* Sidebar ads (outside active write/edit areas) */}
        <AdSidebar slot="history-sidebar" />
      </div>

      {/* Bottom Ad banner */}
      <AdBanner slot="history-bottom" className="mt-8" />
    </div>
  );
}
