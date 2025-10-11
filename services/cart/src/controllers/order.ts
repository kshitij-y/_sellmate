import {
  getDb,
  cart,
  cartItems,
  orders,
  orderItems,
  eq,
} from "@kshitij_npm/sell_db";
import { sendResponse } from "../utils/response.js";
import { Context } from "hono";

const db = getDb();

export const orderCart = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const userId = authUser.id;

    // Get cart
    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);
    if (!userCart.length) return sendResponse(c, 400, false, "Cart is empty");

    const cartId = userCart[0].id;

    // Get cart items
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));
    if (!items.length) return sendResponse(c, 400, false, "Cart has no items");

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        id: crypto.randomUUID(),
        userId,
        totalAmount,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Insert order items
    const orderItemsValues = items
      .filter((item) => item.storeProductId)
      .map((item) => ({
        id: crypto.randomUUID(),
        orderId: newOrder.id,
        storeProductId: item.storeProductId!,
        quantity: item.quantity,
        price: item.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    await db.insert(orderItems).values(orderItemsValues);

    // Clear cart
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));

    return sendResponse(c, 201, true, "Order placed successfully", {
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Error ordering cart:", error);
    return sendResponse(c, 500, false, "Failed to place order");
  }
};

