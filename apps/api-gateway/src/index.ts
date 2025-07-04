import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@sellmate/auth";
import { sendResponse } from "./utils/response.js";
import { userRoutes } from "./routes/user.js";
import { cartRoutes } from "./routes/cart.js";
import { wishRoutes } from "./routes/wish.js";
import { productRoutes } from "./routes/product.js";

const app = new Hono();
app.use("*", async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  await next();
});

app.use(
  cors({
    origin: "http://localhost:3001",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
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
serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
