import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware";
import { address } from "./routes/address";
import profileRouter from "./routes/profile";


const app = new Hono();
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


app.route("/address", address);
app.route("/profile", profileRouter);


const port = Number(process.env.PORT);
console.log(`[user] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
