import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

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
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
