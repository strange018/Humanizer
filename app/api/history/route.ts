import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const mode = searchParams.get("mode") || "";

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { originalText: { contains: search, mode: "insensitive" as const } },
          { rewrittenText: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(mode && { mode }),
    };

    const [rewrites, total] = await Promise.all([
      prisma.rewrite.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          originalText: true,
          rewrittenText: true,
          mode: true,
          wordCount: true,
          charCount: true,
          createdAt: true,
        },
      }),
      prisma.rewrite.count({ where }),
    ]);

    return NextResponse.json({
      rewrites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[HISTORY GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Rewrite ID required" }, { status: 400 });
    }

    // Verify ownership
    const rewrite = await prisma.rewrite.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!rewrite) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.rewrite.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[HISTORY DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
