import { Context, Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware.js";
import profileRouter from "./routes/profile.js";

import { cors } from "hono/cors";
import { getSession } from "@kshitij_npm/sell_auth";
const api = process.env.api || "http://ec2-13-61-14-231.eu-north-1.compute.amazonaws.com:3002";

const app = new Hono();


app.use(
  cors({
    origin: api,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);



app.use("*", async (c, next) => {
  const method = c.req.method;
  const url = c.req.url;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  await next();
});
app.use("*", authMiddleware);

app.get("/", (c) => {
  return c.text("Hello from the user service!");
});


// app.route("/address", address);
app.route("/profile", profileRouter);

app.get("/check", async (c) => {
    // Log all headers
    console.log("Headers:", c.req.header());

    // Log raw Node request (for cookies, etc.)
    console.log("Raw Request headers:", c.req.raw.headers);

    // Log cookies specifically
    console.log("Cookies:", c.req.header("cookie"));

    // Try getting the session
    const session = await getSession(c.req.raw);
    console.log("Session:", session);

    return c.json({ session });
});



const port = Number(process.env.PORT);
console.log(`[user] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });
