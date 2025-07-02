import { sendResponse } from "./response";
import { getSession } from "@sellmate/auth";
import type { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler<any, "*"> = async (c, next) => {
  try {
    const session = await getSession(c.req.raw);
    if (!session) {
      console.log("No session", session);
      c.set("user", null);
      c.set("session", null);
      return next();
    }

    // console.log("Session found:", session);

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return sendResponse(c, 401, false, "Authentication failed", null);
  }
};
