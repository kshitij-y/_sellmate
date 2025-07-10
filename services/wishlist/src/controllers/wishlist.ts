import {
  getDb,
  eq,
  and,
  wishlist,
  wishlist_item,
  product_item
} from "@sellmate/db";

import { Context } from "hono";
import { sendResponse } from "../utils/response";
import { v4 as uuidv4 } from "uuid";

const db = getDb();

export const getItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user)
      return sendResponse(c, 401, false, "Unauthorized: User not found");

    const userId = user.id;

    const userWishlist = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.user_id, userId))
      .limit(1);

    if (userWishlist.length === 0)
      return sendResponse(c, 200, true, "Wishlist is empty", null);

    const items = await db
      .select({
        id: wishlist_item.id,
        quantity: wishlist_item.quantity,
        sku: product_item.sku,
        price: product_item.price,
      })
      .from(wishlist_item)
      .leftJoin(
        product_item,
        eq(wishlist_item.product_item_id, product_item.id)
      )
      .where(eq(wishlist_item.wishlist_id, userWishlist[0].id));

    return sendResponse(c, 200, true, "Wishlist fetched successfully", {
      wishlist: userWishlist[0],
      items,
    });
  } catch (error) {
    return sendResponse(c, 500, false, "Failed to fetch wishlist", null, error);
  }
};

export const addItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user)
      return sendResponse(c, 401, false, "Unauthorized: User not found");

    const userId = user.id;

    const { product_item_id, quantity } = await c.req.json();
    if (!product_item_id || !quantity || quantity <= 0)
      return sendResponse(c, 400, false, "Invalid input");

    let userWishlist = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.user_id, userId))
      .limit(1);

    let wishlistId: string;
    if (userWishlist.length === 0) {
      wishlistId = uuidv4();
      await db.insert(wishlist).values({ id: wishlistId, user_id: userId });
    } else {
      wishlistId = userWishlist[0].id;
    }

    const existingItem = await db
      .select()
      .from(wishlist_item)
      .where(
        and(
          eq(wishlist_item.wishlist_id, wishlistId),
          eq(wishlist_item.product_item_id, product_item_id)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity (optional, based on your app logic)
      await db
        .update(wishlist_item)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(wishlist_item.id, existingItem[0].id));
    } else {
      await db.insert(wishlist_item).values({
        id: uuidv4(),
        wishlist_id: wishlistId,
        product_item_id,
        quantity,
      });
    }

    return sendResponse(c, 200, true, "Item added to wishlist");
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to add item to wishlist",
      null,
      error
    );
  }
};

export const removeItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user)
      return sendResponse(c, 401, false, "Unauthorized: User not found");

    const userId = user.id;

    const { wishlist_item_id } = await c.req.json();
    if (!wishlist_item_id)
      return sendResponse(c, 400, false, "Missing wishlist_item_id");

    const userWishlist = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.user_id, userId))
      .limit(1);

    if (userWishlist.length === 0)
      return sendResponse(c, 404, false, "Wishlist not found");

    const item = await db
      .select()
      .from(wishlist_item)
      .where(
        and(
          eq(wishlist_item.id, wishlist_item_id),
          eq(wishlist_item.wishlist_id, userWishlist[0].id)
        )
      )
      .limit(1);

    if (item.length === 0)
      return sendResponse(c, 404, false, "Wishlist item not found");

    await db
      .delete(wishlist_item)
      .where(eq(wishlist_item.id, wishlist_item_id));

    return sendResponse(c, 200, true, "Item removed from wishlist");
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to remove item from wishlist",
      null,
      error
    );
  }
};

export const updateItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user)
      return sendResponse(c, 401, false, "Unauthorized: User not found");

    const userId = user.id;

    const { wishlist_item_id, quantity } = await c.req.json();
    if (!wishlist_item_id || !quantity || quantity <= 0)
      return sendResponse(c, 400, false, "Invalid input");

    const userWishlist = await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.user_id, userId))
      .limit(1);

    if (userWishlist.length === 0)
      return sendResponse(c, 404, false, "Wishlist not found");

    const item = await db
      .select()
      .from(wishlist_item)
      .where(
        and(
          eq(wishlist_item.id, wishlist_item_id),
          eq(wishlist_item.wishlist_id, userWishlist[0].id)
        )
      )
      .limit(1);

    if (item.length === 0)
      return sendResponse(c, 404, false, "Wishlist item not found");

    await db
      .update(wishlist_item)
      .set({ quantity })
      .where(eq(wishlist_item.id, wishlist_item_id));

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
