import { sendResponse } from "./response";
import { getDb, sql } from "@kshitij_npm/sell_db";
import type { MiddlewareHandler } from "hono";
const db = getDb();

export const adminOnly: MiddlewareHandler<any, "*"> = async (c, next) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Authentication required", null);
    }

    const result = await db.execute(
      sql`SELECT is_admin FROM admin WHERE user_id = ${user.id} LIMIT 1`
    );

    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return sendResponse(c, 403, false, "Access denied: Admins only", null);
    }

    return next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return sendResponse(c, 500, false, "Internal server error", null);
  }
};
