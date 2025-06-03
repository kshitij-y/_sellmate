import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { db } from "@sellmate/db";
import { user } from "@sellmate/db/drizzle/schema";
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello from the user service!");
});

app.get("/users", async (c) => {
  try {
      const users = await db.select().from(user);
    return c.json({ users });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

const port = Number(process.env.PORT);
console.log(`[user] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
