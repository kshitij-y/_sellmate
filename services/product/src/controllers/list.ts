import { getDb, listing, eq,  } from "@kshitij_npm/sell_db";

import type { Context } from "hono";
import { sendResponse } from "../utils/response";

const db = getDb();

export const createListing = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const body = await c.req.json();
    const { title, description, price, images, category, condition } = body;

    if (!title || !price) {
      return sendResponse(c, 400, false, "Title and price are required");
    }

    const newListing = await db
      .insert(listing)
      .values({
        id: crypto.randomUUID(),
        sellerId: authUser.id,
        title,
        description: description || null,
        condition,
        category: category || null,
        price,
        images: images || [],
        location: typeof location === "string" ? location : null,
        isSold: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return sendResponse(
      c,
      201,
      true,
      "Listing created successfully",
      newListing[0]
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    return sendResponse(c, 500, false, "Failed to create listing");
  }
};

export const getListing = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const result = await db
      .select()
      .from(listing)
      .where(eq(listing.id, id))
      .limit(1);

    if (!result[0]) return sendResponse(c, 404, false, "Listing not found");

    return sendResponse(
      c,
      200,
      true,
      "Listing fetched successfully",
      result[0]
    );
  } catch (error) {
    console.error("Error fetching listing:", error);
    return sendResponse(c, 500, false, "Failed to fetch listing");
  }
};

export const getSellerListings = async (c: Context) => {
  try {
    const sellerId = c.req.param("sellerId");
    if (!sellerId) return sendResponse(c, 400, false, "Seller ID is required");

    const results = await db
      .select()
      .from(listing)
      .where(eq(listing.sellerId, sellerId));

    return sendResponse(c, 200, true, "Listings fetched successfully", results);
  } catch (error) {
    console.error("Error fetching seller listings:", error);
    return sendResponse(c, 500, false, "Failed to fetch seller listings");
  }
};

export const updateListing = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    const { id } = c.req.param();
    const body = await c.req.json();

    const updatedFields: any = {
      ...body,
      updatedAt: new Date(),
    };

    // Ensure price is string for decimal
    if (body.price) updatedFields.price = body.price.toString();

    const result = await db
      .update(listing)
      .set(updatedFields)
      .where(eq(listing.id, id))
      .returning();

    if (!result[0]) return sendResponse(c, 404, false, "Listing not found");

    return sendResponse(
      c,
      200,
      true,
      "Listing updated successfully",
      result[0]
    );
  } catch (error) {
    console.error("Error updating listing:", error);
    return sendResponse(c, 500, false, "Failed to update listing");
  }
};


export const deleteListing = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const result = await db
      .delete(listing)
      .where(eq(listing.id, id))
      .returning();

    if (!result[0]) return sendResponse(c, 404, false, "Listing not found");

    return sendResponse(
      c,
      200,
      true,
      "Listing deleted successfully",
      result[0]
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
    return sendResponse(c, 500, false, "Failed to delete listing");
  }
};
