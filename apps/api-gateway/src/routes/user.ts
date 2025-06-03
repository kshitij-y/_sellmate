import { Hono } from "hono";

const user_service_url = process.env.USER_SERVICE_URL!;

export const userRoutes = new Hono();

userRoutes.all("/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/user/, "");
  const url = `${user_service_url}${path}`;
  const req = c.req;

  const proxyRes = await fetch(url, {
    method: req.method,
    headers: req.raw.headers,
    body: req.raw.body ? req.raw.clone().body : undefined,
    credentials: "include",
  });
  

  const body = await proxyRes.text();
  return new Response(body, {
    status: proxyRes.status,
    headers: proxyRes.headers,
  });
});
