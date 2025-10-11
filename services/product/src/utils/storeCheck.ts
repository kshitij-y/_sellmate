import { Context, Next } from "hono";
import { sendResponse } from "./response.js";
import { getDb, sql } from "@kshitij_npm/sell_db";

const db = getDb();

/**
 * Middleware to check if the authenticated user owns the store
 */
export const storeOwnershipMiddleware = async (c: Context, next: Next) => {
  const authUser = c.get("user");
  if (!authUser) {
    return sendResponse(c, 401, false, "Unauthorized");
  }

  const storeId = c.req.param("storeId");
  if (!storeId) {
    return sendResponse(c, 400, false, "Store ID is required");
  }

  try {
    const result = await db.execute(
      sql`SELECT id FROM store WHERE id = ${storeId} AND owner_id = ${authUser.id}`
    );

    if (result.rows.length === 0) {
      return sendResponse(
        c,
        403,
        false,
        "Forbidden: You do not own this store"
      );
    }
    

    await next();
  } catch (error) {
    console.error("storeOwnershipMiddleware error:", error);
    return sendResponse(c, 500, false, "Internal server error");
  }
};
