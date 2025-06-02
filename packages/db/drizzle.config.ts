import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { join } from "path";
dotenv.config({ path: join(__dirname, "../../../.env") });
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  out: "./packages/db/drizzle",
  schema: "./packages/db/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
