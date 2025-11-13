import { Context } from "hono";
import { getDb, orders, orderItems, storeProducts, eq } from "@kshitij_npm/sell_db";
import { sendResponse } from "../utils/response.js";
import crypto from "crypto";

const db = getDb();

// Buy-now / order a single store product
export const orderStoreProduct = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const storeId = c.req.param("storeId");
    const productId = c.req.param("productId");
    if (!storeId || !productId)
      return sendResponse(c, 400, false, "storeId and productId are required");

    const body = await c.req.json().catch(() => ({}));
    const quantity = Math.max(1, Number(body.quantity || 1));

    // Fetch product
    const products = await db
      .select()
      .from(storeProducts)
      .where(eq(storeProducts.id, productId))
      .limit(1);

    const product = products[0];
    if (!product) return sendResponse(c, 404, false, "Product not found");
    if (!product.isActive) return sendResponse(c, 400, false, "Product is not available");
    const stock = Number(product.stock || 0);
    if (stock < quantity)
      return sendResponse(c, 400, false, "Insufficient stock");

    const totalAmount = product.price * quantity;

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        id: crypto.randomUUID(),
        userId: authUser.id,
        totalAmount,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Insert order item
    await db.insert(orderItems).values({
      id: crypto.randomUUID(),
      orderId: newOrder.id,
      storeProductId: productId,
      quantity,
      price: product.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Decrement stock
    const updated = await db
      .update(storeProducts)
      .set({ stock: stock - quantity, updatedAt: new Date() })
      .where(eq(storeProducts.id, productId))
      .returning();

    return sendResponse(c, 201, true, "Order placed successfully", {
      orderId: newOrder.id,
      remainingStock: updated[0]?.stock ?? null,
    });
  } catch (error) {
    console.error("Error ordering product:", error);
    return sendResponse(c, 500, false, "Failed to place order");
  }
};
