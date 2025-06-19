import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware.js";
import {
  updateItem,
  removeItem,
  addItem,
  getItem,
} from "./controllers/wishlist.js";

const app = new Hono();
app.use("*", async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  await next();
});
app.use("*", authMiddleware);

app.get("/", (c) => {
  return c.text("Hello from the wishlist service!");
});

app.get("/getWishlist", getItem);
app.post("/addItem", addItem);
app.delete("/removeItem", removeItem);
app.put("/updateItem", updateItem);

const port = Number(process.env.PORT);
console.log(`[wishlist] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
