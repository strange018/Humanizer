import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/humanize_ai",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "test@humanize.ai";
  const hashedPassword = await bcrypt.hash("password123", 12);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!existing) {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email,
        password: hashedPassword,
      },
    });

    console.log("Database seeded successfully. You can log in using:");
    console.log(`Email: ${user.email}`);
    console.log("Password: password123");
  } else {
    console.log("Test user already exists.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
