import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware.js";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "./controllers/cart.js";

const app = new Hono();
app.use("*", async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  await next();
});
app.use("*", authMiddleware);

app.get("/", (c) => {
  return c.text("Hello from the cart service!");
});

app.get("/getCart", getCart);
app.post("/addItem", addItemToCart);
app.delete("/removeItem", removeItemFromCart);
app.put("/updateItem", updateCartItemQuantity);

const port = Number(process.env.PORT);
console.log(`[cart] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
