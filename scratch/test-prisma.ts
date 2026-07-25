import { prisma } from "../lib/prisma";

async function testPrisma() {
  try {
    console.log("Attempting to query Prisma...");
    const count = await prisma.user.count();
    console.log("User count:", count);
  } catch (err: any) {
    console.error("Prisma error:", err.message || err);
  }
}

testPrisma();
