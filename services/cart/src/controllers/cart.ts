import {
  getDb,
  cart,
  cartItems,
  storeProducts,
  eq,
} from "@kshitij_npm/sell_db";
import { sendResponse } from "../utils/response.js";
import { Context } from "hono";

const db = getDb();

export const getCart = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const userId = authUser.id;

    // Step 1: Check if cart exists
    let userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    // Step 2: Create cart if not found
    if (!userCart.length) {
      const [newCart] = await db
        .insert(cart)
        .values({
          id: crypto.randomUUID(),
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      userCart = [newCart];
    }

    const cartId = userCart[0].id;

    // Step 3: Join cartItems with storeProducts using Drizzle
    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        price: cartItems.price,
        name: storeProducts.name,
        images: storeProducts.images,
        category: storeProducts.category,
      })
      .from(cartItems)
      .innerJoin(storeProducts, eq(cartItems.storeProductId, storeProducts.id))
      .where(eq(cartItems.cartId, cartId));

    return sendResponse(c, 200, true, "Cart fetched successfully", {
      cartId,
      items,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return sendResponse(c, 500, false, "Failed to fetch cart");
  }
};

export const addToCart = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const userId = authUser.id;
    const body = await c.req.json();
    const { storeProductId, quantity = 1 } = body;

    if (!storeProductId)
      return sendResponse(c, 400, false, "storeProductId is required");

    // Step 1: Ensure the user has a cart
    let userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (!userCart.length) {
      const [newCart] = await db
        .insert(cart)
        .values({
          id: crypto.randomUUID(),
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      userCart = [newCart];
    }

    const cartId = userCart[0].id;

    // Step 2: Check if the product is already in the cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(
        eq(cartItems.cartId, cartId) &&
        eq(cartItems.storeProductId, storeProductId)
      )
      .limit(1);

    if (existingItem.length) {
      // Increment quantity
      const updatedItem = await db
        .update(cartItems)
        .set({
          quantity: existingItem[0].quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();

      return sendResponse(c, 200, true, "Cart item updated", updatedItem[0]);
    } else {
      // Step 3: Get price from storeProducts
      const product = await db
        .select({ price: storeProducts.price })
        .from(storeProducts)
        .where(eq(storeProducts.id, storeProductId))
        .limit(1);

      if (!product.length)
        return sendResponse(c, 404, false, "Product not found");

      // Step 4: Add new item to cart
      const [newItem] = await db
        .insert(cartItems)
        .values({
          id: crypto.randomUUID(),
          cartId,
          storeProductId,
          quantity,
          price: product[0].price,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return sendResponse(c, 201, true, "Product added to cart", newItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return sendResponse(c, 500, false, "Failed to add to cart");
  }
};

export const updateCartItem = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const userId = authUser.id;
    const itemId = c.req.param("itemId");
    const body = await c.req.json();
    const { quantity, price } = body;

    if (quantity === undefined && price === undefined)
      return sendResponse(c, 400, false, "Nothing to update");

    // Step 1: Verify the item belongs to the user's cart
    const item = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
      })
      .from(cartItems)
      .innerJoin(cart, eq(cartItems.cartId, cart.id))
      .where(eq(cartItems.id, itemId) && eq(cart.userId, userId))
      .limit(1);

    if (!item.length) return sendResponse(c, 404, false, "Cart item not found");

    // Step 2: Update the item
    const [updatedItem] = await db
      .update(cartItems)
      .set({
        ...(quantity !== undefined && { quantity }),
        ...(price !== undefined && { price }),
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, itemId))
      .returning();

    return sendResponse(c, 200, true, "Cart item updated", updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return sendResponse(c, 500, false, "Failed to update cart item");
  }
};

export const removeCartItem = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const userId = authUser.id;
    const itemId = c.req.param("itemId");

    // Step 1: Verify item belongs to user's cart
    const item = await db
      .select({
        id: cartItems.id,
      })
      .from(cartItems)
      .innerJoin(cart, eq(cartItems.cartId, cart.id))
      .where(eq(cartItems.id, itemId) && eq(cart.userId, userId))
      .limit(1);

    if (!item.length) return sendResponse(c, 404, false, "Cart item not found");

    // Step 2: Delete the cart item
    await db.delete(cartItems).where(eq(cartItems.id, itemId));

    return sendResponse(c, 200, true, "Cart item removed successfully");
  } catch (error) {
    console.error("Error removing cart item:", error);
    return sendResponse(c, 500, false, "Failed to remove cart item");
  }
};

export const clearCart = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const userId = authUser.id;

    // Step 1: Get user's cart
    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (!userCart.length) {
      // Cart doesn't exist — nothing to clear
      return sendResponse(c, 200, true, "Cart cleared", { itemsCleared: 0 });
    }

    const cartId = userCart[0].id;

    // Step 2: Delete all cart items
    const deletedCount = await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cartId));

    return sendResponse(c, 200, true, "Cart cleared successfully", {
      itemsCleared: deletedCount,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return sendResponse(c, 500, false, "Failed to clear cart");
  }
};