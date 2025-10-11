import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware.js";

// import catRouter from "./routes/categories.js";
// import varRouter from "./routes/variation.js";
import storeRouter from "./routes/store.js";
import listingRouter from "./routes/list.js";


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




//updated
app.route("/listings", listingRouter);
app.route("/store", storeRouter)

const port = Number(process.env.PORT);
console.log(`[product] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
