import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@kshitij_npm/sell_auth";
import { sendResponse } from "./utils/response.js";
import { userRoutes } from "./routes/user.js";
import { cartRoutes } from "./routes/cart.js";
import { wishRoutes } from "./routes/wish.js";
import { productRoutes } from "./routes/product.js";
import { storeRoutes } from "./routes/store.js";

import "dotenv/config";

const app = new Hono();
app.use("*", async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  await next();
});

const fe_url =
  process.env.FE_URL ||
  "http://ec2-13-61-14-231.eu-north-1.compute.amazonaws.com:3001";

app.use(
  cors({
    origin: fe_url,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});


app.get("/", (c) => {
  return c.text("Hello Hono!");
});


app.notFound((c) => {
  return sendResponse(c, 404, false, "Route not found");
});

app.route("/api/user", userRoutes);
app.route("/api/cart", cartRoutes);
app.route("/api/wishlist", wishRoutes);
app.route("/api/product", productRoutes);
app.route("/api/store", storeRoutes);

const port = Number(process.env.PORT);
serve(
  {
    fetch: app.fetch,
    port: port,
    hostname: "0.0.0.0",
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
