import { Context } from "hono";
import { getDb, orders, orderItems, listing, eq } from "@kshitij_npm/sell_db";
import { sendResponse } from "../utils/response.js";
import crypto from "crypto";

const db = getDb();

// Order a second-hand listing (buy now)
export const orderListing = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const listingId = c.req.param("id");
    if (!listingId) return sendResponse(c, 400, false, "Listing ID required");

    const body = await c.req.json().catch(() => ({}));
    const quantity = Math.max(1, Number(body.quantity || 1));

    // Use a transaction to ensure we don't race and oversell
    const result = await db.transaction(async (tx) => {
      // Re-fetch listing inside transaction
      const rows = await tx
        .select()
        .from(listing)
        .where(eq(listing.id, listingId))
        .limit(1);

      const item = rows[0];
      if (!item) throw new Error("LISTING_NOT_FOUND");
      if (item.isSold) throw new Error("LISTING_SOLD");

      // For listings, stock is implicit: quantity should be 1 normally
      if (quantity !== 1) throw new Error("INVALID_QUANTITY");

      const totalAmount = item.price * quantity;

      const [newOrder] = await tx.insert(orders).values({
        id: crypto.randomUUID(),
        userId: authUser.id,
        totalAmount,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      await tx.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId: newOrder.id,
        listingId: listingId,
        quantity,
        price: item.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      // Mark listing as sold
      const updated = await tx
        .update(listing)
        .set({ isSold: true, updatedAt: new Date() })
        .where(eq(listing.id, listingId))
        .returning();

      if (!updated.length) throw new Error("FAILED_UPDATE_LISTING");

      return {
        orderId: newOrder.id,
      };
    });

    return sendResponse(c, 201, true, "Listing ordered successfully", result);
  } catch (error: any) {
    console.error("Error ordering listing:", error);
    if (error.message === "LISTING_NOT_FOUND") return sendResponse(c, 404, false, "Listing not found");
    if (error.message === "LISTING_SOLD") return sendResponse(c, 400, false, "Listing already sold");
    if (error.message === "INVALID_QUANTITY") return sendResponse(c, 400, false, "Invalid quantity for listing (must be 1)");
    return sendResponse(c, 500, false, "Failed to place listing order");
  }
};
