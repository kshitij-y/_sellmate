import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config";
import { authMiddleware } from "./utils/authMiddleware.js";
import { cors } from "hono/cors";
const api = process.env.api!;

import storeRoute from './routes/store.route.js'

const app = new Hono();

app.use(
  cors({
    origin: [api, 'http://localhost:3001'],
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

app.get('/', (c) => {
  return c.text('Store service is working')
})

//routes
app.route('/init', storeRoute);



const port = Number(process.env.PORT);
console.log(`[store] service running on http://localhost:${port}`);
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });

