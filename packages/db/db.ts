import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./drizzle/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("Connecting to DB with URL:", process.env.DATABASE_URL);

pool
  .connect()
  .then((client) => {
    console.log("✅ DB connected");
    client.release();
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });

export const db = drizzle(pool, { schema });
export type DB = typeof db;
