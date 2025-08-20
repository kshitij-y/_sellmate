import { Hono } from "hono";
import { proxy } from "hono/proxy";

const product_service_url = process.env.PRODUCT_SERVICE_URL!;

export const productRoutes = new Hono();

productRoutes.all("/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/product/, "");
  const url = `${product_service_url}${path}`;

  const headers = new Headers(c.req.header());
  const cookie = c.req.header("cookie");
  if (cookie) headers.set("cookie", cookie);

  const res = await proxy(url, {
    method: c.req.method,
    headers,
    body: c.req.raw.body ? c.req.raw.clone().body : undefined,
    credentials: "include",
  });

  res.headers.delete("content-encoding");
  return res;
});
