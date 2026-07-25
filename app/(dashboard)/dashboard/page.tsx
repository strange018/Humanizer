import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";
import { REWRITE_MODES, type RewriteMode } from "@/lib/openai";
import { formatDate } from "@/lib/utils";
import { BarChart3, FileText, Sparkles, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable server caching to ensure stats stay up-to-date

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch stats directly in the Server Component
  const [totalRewrites, modeGroups, recentRewrites] = await Promise.all([
    prisma.rewrite.count({
      where: { userId: session.user.id },
    }),
    prisma.rewrite.groupBy({
      by: ["mode"],
      where: { userId: session.user.id },
      _count: { mode: true },
    }),
    prisma.rewrite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const wordSum = await prisma.rewrite.aggregate({
    where: { userId: session.user.id },
    _sum: { wordCount: true },
  });

  const totalWords = wordSum._sum.wordCount || 0;

  // Transform mode stats
  const modeStats = modeGroups.map((group: any) => ({
    mode: group.mode as RewriteMode,
    count: group._count.mode,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner Ad slot (outside editing area) */}
      <AdBanner slot="dashboard-top" className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome, {session.user.name || session.user.email}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here is your Humanize AI dashboard and rewriting usage overview.
            </p>
          </div>

          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 glow flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Rewrites
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">{totalRewrites}</h3>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 glow flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Words Processed
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">{totalWords}</h3>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-card/60 glow flex items-center gap-4">
              <div className="p-3.5 rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Writing Efficiency
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">Active</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode Distribution */}
            <div className="p-6 rounded-2xl border border-border bg-card/40 flex flex-col justify-between">
              <h3 className="font-semibold text-base text-foreground mb-4">Rewrites By Style</h3>
              {modeStats.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-xs text-muted-foreground text-center">
                  No rewrites processed yet. Start humanizing to view metrics.
                </div>
              ) : (
                <div className="space-y-3 flex-1 justify-center flex flex-col">
                  {modeStats.map((stat: any) => {
                    const modeDetail = REWRITE_MODES[stat.mode as RewriteMode] || { label: stat.mode, emoji: "✍️" };
                    const percentage = totalRewrites > 0 ? (stat.count / totalRewrites) * 100 : 0;

                    return (
                      <div key={stat.mode} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span>{modeDetail.emoji}</span>
                            <span>{modeDetail.label}</span>
                          </span>
                          <span className="text-muted-foreground">
                            {stat.count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-2xl border border-border bg-card/40 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-base text-foreground mb-2">Need to rewrite text?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Go to our distraction-free, ad-free editor to input text, upload files, and translate AI writing to natural human output.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/editor"
                  className="w-full py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer text-center"
                >
                  <Sparkles className="h-4 w-4" /> Open Editor
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Rewrites */}
          <div className="p-6 rounded-2xl border border-border bg-card/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base text-foreground">Recent Rewrites</h3>
              {recentRewrites.length > 0 && (
                <Link
                  href="/history"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            {recentRewrites.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recent rewrites found.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentRewrites.map((rewrite: any) => {
                  const modeDetail = REWRITE_MODES[rewrite.mode as RewriteMode] || {
                    label: rewrite.mode,
                    emoji: "✍️",
                  };
                  return (
                    <div key={rewrite.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate max-w-[300px] sm:max-w-[450px]">
                          {rewrite.title || "Untitled Rewrite"}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(rewrite.createdAt)}
                          </span>
                          <span>•</span>
                          <span>{rewrite.wordCount} words</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                        {modeDetail.emoji} {modeDetail.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Ad Sidebar Column (completely outside editing screen) */}
        <AdSidebar slot="dashboard-sidebar" />
      </div>

      {/* Bottom Ad slot (outside editing area) */}
      <AdBanner slot="dashboard-bottom" className="mt-8" />
    </div>
  );
}
