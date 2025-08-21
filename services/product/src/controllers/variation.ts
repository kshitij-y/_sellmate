import { getDb, variation, variation_option, eq, ne } from "@kshitij_npm/sell_db";
import { Context } from "hono";
import { sendResponse } from "../utils/response";

const db = getDb();

export const addVariation = async (c: Context) => {
  try {
    let { name } = await c.req.json();

    if (!name) {
      return sendResponse(c, 400, false, "Variation name is required", null);
    }

    name = name.toUpperCase(); // Convert to uppercase

    // Check if it already exists
    const existing = await db
      .select()
      .from(variation)
      .where(eq(variation.name, name));
    if (existing.length > 0) {
      return sendResponse(c, 409, false, "Variation already exists", null);
    }

    const varItem = await db.insert(variation).values({ name }).returning();

    return sendResponse(c, 201, true, "Variation added successfully", varItem);
  } catch (error) {
    return sendResponse(c, 500, false, "Failed to add variation", null, error);
  }
};


export const getVariations = async (c: Context) => {
  try {
    const { id } = await c.req.json();

    const result = id
      ? await db.select().from(variation).where(eq(variation.id, id))
      : await db.select().from(variation);

    return sendResponse(
      c,
      200,
      true,
      "Variations fetched successfully",
      result
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to fetch variations",
      null,
      error
    );
  }
};


export const updateVariation = async (c: Context) => {
  try {
    const { id, name: rawName } = await c.req.json();

    if (!id)
      return sendResponse(c, 400, false, "Variation ID is required", null);
    if (!rawName)
      return sendResponse(c, 400, false, "Variation name is required", null);

    const name = rawName.toUpperCase();

      const duplicate = await db
          .select()
          .from(variation)
          .where(eq(variation.name, name) && ne(variation.id, id));
    if (duplicate.length > 0) {
      return sendResponse(c, 409, false, "Variation name already exists", null);
    }

    const updated = await db
      .update(variation)
      .set({ name })
      .where(eq(variation.id, id));

    if (!updated.count)
      return sendResponse(c, 404, false, "Variation not found", null);

    return sendResponse(
      c,
      200,
      true,
      "Variation updated successfully",
      updated
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to update variation",
      null,
      error
    );
  }
};


export const deleteVariation = async (c: Context) => {
  try {
    const { id } = await c.req.json();

    if (!id)
      return sendResponse(c, 400, false, "Variation ID is required", null);

    const deleted = await db.delete(variation).where(eq(variation.id, id));

    if (!deleted.count)
      return sendResponse(c, 404, false, "Variation not found", null);

    return sendResponse(
      c,
      200,
      true,
      "Variation deleted successfully",
      deleted
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to delete variation",
      null,
      error
    );
  }
};
