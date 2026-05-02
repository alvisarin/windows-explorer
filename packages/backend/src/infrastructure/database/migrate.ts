import { migrate } from "drizzle-orm/mysql2";
import { db } from "./connection";

async function runMigration() {
  console.log("Running migrations...");

  await migrate(db, {
    migrationsFolder: "./src/infrastructure/database/migrations",
  });

  console.log("Migrations completed successfully!");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
