import pg from "pg";

async function testPassword(password: string): Promise<boolean> {
  const connectionString = `postgresql://postgres:${password}@localhost:5432/postgres`;
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    await client.end();
    return true;
  } catch (err: any) {
    return false;
  }
}

async function main() {
  const commonPasswords = ["", "password", "postgres", "admin", "root", "1234", "123456", "12345678", "password123"];
  console.log("Searching for working local PostgreSQL password...");

  for (const pw of commonPasswords) {
    console.log(`Trying password: "${pw}"...`);
    const success = await testPassword(pw);
    if (success) {
      console.log(`\n✅ FOUND WORKING PASSWORD: "${pw}"`);
      console.log(`Please update your DATABASE_URL to use this password:`);
      console.log(`DATABASE_URL="postgresql://postgres:${pw}@localhost:5432/humanize_ai"`);
      return;
    }
  }

  console.log("\n❌ Could not find a working PostgreSQL password automatically.");
  console.log("Please check your local PostgreSQL server installation credentials or configure your .env file accordingly.");
}

main();
