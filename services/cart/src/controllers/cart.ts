import { getDb, eq, and, cart, cart_items, product_item } from "@kshitij_npm/sell_db";
import { Context } from "hono";
import { sendResponse } from "../utils/response";
import { v4 as uuidv4 } from "uuid";

const db = getDb();

export const getCart = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const userId = user.id;

    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.user_id, userId))
      .limit(1);
    if (userCart.length === 0)
      return sendResponse(c, 200, true, "Cart is empty", null);

    const items = await db
      .select({
        id: cart_items.id,
        quantity: cart_items.quantity,
        sku: product_item.sku,
        price: product_item.price,
      })
      .from(cart_items)
      .leftJoin(product_item, eq(cart_items.product_item_id, product_item.id))
      .where(eq(cart_items.cart_id, userCart[0].id));

    return sendResponse(c, 200, true, "Cart fetched successfully", {
      cart: userCart[0],
      items,
    });
  } catch (error) {
    return sendResponse(c, 500, false, "Failed to fetch cart", null, error);
  }
};

export const addItemToCart = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const userId = user.id;

    const { product_item_id, quantity } = await c.req.json();
    if (!product_item_id || !quantity || quantity <= 0)
      return sendResponse(c, 400, false, "Invalid input");

    let userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.user_id, userId))
      .limit(1);
    let cartId: string;
    if (userCart.length === 0) {
      cartId = uuidv4();
      await db.insert(cart).values({ id: cartId, user_id: userId });
    } else {
      cartId = userCart[0].id;
    }

    const existingItem = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.cart_id, cartId),
          eq(cart_items.product_item_id, product_item_id)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      await db
        .update(cart_items)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cart_items.id, existingItem[0].id));
    } else {
      await db.insert(cart_items).values({
        id: uuidv4(),
        cart_id: cartId,
        product_item_id,
        quantity,
      });
    }

    return sendResponse(c, 200, true, "Item added to cart");
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to add item to cart",
      null,
      error
    );
  }
};

export const removeItemFromCart = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const userId = user.id;

    const { cart_item_id } = await c.req.json();
    if (!cart_item_id)
      return sendResponse(c, 400, false, "Missing cart_item_id");

    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.user_id, userId))
      .limit(1);
    if (userCart.length === 0) {
      return sendResponse(c, 404, false, "Cart not found");
    }
    const item = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.id, cart_item_id),
          eq(cart_items.cart_id, userCart[0].id)
        )
      )
      .limit(1);

    if (item.length === 0)
      return sendResponse(c, 404, false, "Cart item not found");

    await db.delete(cart_items).where(eq(cart_items.id, cart_item_id));

    return sendResponse(c, 200, true, "Item removed from cart");
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to remove item from cart",
      null,
      error
    );
  }
};

export const updateCartItemQuantity = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const userId = user.id;

    const { cart_item_id, quantity } = await c.req.json();
    if (!cart_item_id || !quantity || quantity <= 0)
      return sendResponse(c, 400, false, "Invalid input");

    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.user_id, userId))
      .limit(1);
    if (userCart.length === 0)
      return sendResponse(c, 404, false, "Cart not found");

    const item = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.id, cart_item_id),
          eq(cart_items.cart_id, userCart[0].id)
        )
      )
      .limit(1);

    if (item.length === 0)
      return sendResponse(c, 404, false, "Cart item not found");

    await db
      .update(cart_items)
      .set({ quantity })
      .where(eq(cart_items.id, cart_item_id));

    return sendResponse(c, 200, true, "Quantity updated");
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to update quantity",
      null,
      error
    );
  }
};
