import { Hono } from "hono";
import { serve } from "@hono/node-server";
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware";
import { address } from "./routes/address";


const app = new Hono();

app.use("*", authMiddleware);

app.get("/", (c) => {
  return c.text("Hello from the user service!");
});


app.route("/address", address);


const port = Number(process.env.PORT);
console.log(`[user] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
