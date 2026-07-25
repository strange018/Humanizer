import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const isSqlite = dbUrl.startsWith("file:") || !dbUrl;

if (isSqlite) {
  if (process.env.NODE_ENV === "production") {
    const adapter = new PrismaLibSql({
      url: dbUrl,
    });
    prismaInstance = new PrismaClient({ adapter });
  } else {
    if (!globalForPrisma.prisma) {
      console.log("[Prisma Init] Dev mode. Initializing LibSQL adapter factory with SQLite URL:", dbUrl);
      const adapter = new PrismaLibSql({
        url: dbUrl,
      });
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
      });
    }
    prismaInstance = globalForPrisma.prisma;
  }
} else {
  if (process.env.NODE_ENV === "production") {
    const pool = new pg.Pool({
      connectionString: dbUrl,
    });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
  } else {
    if (!globalForPrisma.prisma) {
      console.log("[Prisma Init] Dev mode. Initializing Postgres pool with URL:", dbUrl);
      const pool = new pg.Pool({
        connectionString: dbUrl,
      });
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
      });
    }
    prismaInstance = globalForPrisma.prisma;
  }
}

export const prisma = prismaInstance;
