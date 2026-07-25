import pg from "pg";

async function testConnection() {
  console.log("Testing PostgreSQL connection...");
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/humanize_ai";
  
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    console.log("✅ Database connection successful!");
    await client.end();
  } catch (err: any) {
    console.error("❌ Database connection failed.");
    console.error("Error details:", err.message);
  }
}

testConnection();
