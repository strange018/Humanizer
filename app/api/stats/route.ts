import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [total, byMode, recentActivity] = await Promise.all([
      prisma.rewrite.count({ where: { userId: session.user.id } }),
      prisma.rewrite.groupBy({
        by: ["mode"],
        where: { userId: session.user.id },
        _count: { mode: true },
      }),
      prisma.rewrite.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, mode: true, wordCount: true, createdAt: true },
      }),
    ]);

    const totalWords = await prisma.rewrite.aggregate({
      where: { userId: session.user.id },
      _sum: { wordCount: true },
    });

    return NextResponse.json({
      totalRewrites: total,
      totalWords: totalWords._sum.wordCount || 0,
      byMode,
      recentActivity,
    });
  } catch (err) {
    console.error("[STATS]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
