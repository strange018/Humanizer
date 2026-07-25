import "dotenv/config";
import { defineConfig } from "prisma/config";

console.log("[Prisma Config] resolved DATABASE_URL is:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});
