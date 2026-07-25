import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  console.log("[Prisma Init] Production mode detected");
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    console.log("[Prisma Init] Dev mode. dbUrl is:", dbUrl);
    const isSqlite = dbUrl.startsWith("file:") || !dbUrl;

    if (isSqlite) {
      console.log("[Prisma Init] Initializing LibSQL adapter factory with URL:", dbUrl);
      const adapter = new PrismaLibSql({
        url: dbUrl,
      });
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
      });
    } else {
      console.log("[Prisma Init] Initializing Postgres pool with URL:", dbUrl);
      const pool = new pg.Pool({
        connectionString: dbUrl,
      });
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
      });
    }
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
