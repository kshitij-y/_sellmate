import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware.js";

import catRouter from "./routes/categories.js";
import varRouter from "./routes/variation.js";
import varOptRouter from "./routes/varOptions.js";

import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "./controllers/product.js";

import {
  addProductItem,
  deleteProductItem,
  getProductItem,
  patchProductItem,
} from "./controllers/product_item.js";

const app = new Hono();
app.use("*", async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  await next();
});
app.use("*", authMiddleware);

app.get("/h", (c) => {
  return c.text("Hello from the product service!");
});

app.route("/categoires", catRouter);
app.route("/variations", varRouter);
app.route("/varOption", varOptRouter);

//product routes
app.get("/product", getProducts);
app.post("/product", addProduct);
app.delete("/product", deleteProduct);
app.put("/product", updateProduct);

app.get("/proItem", getProductItem);
app.post("/proItem", addProductItem);
app.delete("/proItem", deleteProductItem);
app.patch("/proItem", patchProductItem);

const port = Number(process.env.PORT);
console.log(`[product] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
