import "dotenv/config";
import { prisma } from "../lib/prisma";

async function testPrisma() {
  try {
    console.log("DATABASE_URL is:", process.env.DATABASE_URL);
    console.log("Attempting to query Prisma...");
    const count = await prisma.user.count();
    console.log("✅ User count:", count);
  } catch (err: any) {
    console.error("❌ Prisma error stack trace:\n", err.stack || err);
  }
}

testPrisma();
