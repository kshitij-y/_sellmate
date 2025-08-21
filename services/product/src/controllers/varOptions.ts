import { getDb, variation, variation_option, eq, ne } from "@kshitij_npm/sell_db";
import { Context } from "hono";
import { sendResponse } from "../utils/response";

const db = getDb();

export const addVariationOption = async (c: Context) => {
  try {
    let { variation_id, value } = await c.req.json();

    if (!variation_id || !value)
      return sendResponse(
        c,
        400,
        false,
        "Variation ID and value are required",
        null
      );

    value = value.toUpperCase(); // normalize

    // Check duplicate for the same variation
      const existing = await db
          .select()
          .from(variation_option)
          .where(eq(variation_option.variation_id, variation_id) && eq(variation_option.value, value));

    if (existing.length > 0)
      return sendResponse(
        c,
        409,
        false,
        "Option already exists for this variation",
        null
      );

    const option = await db
      .insert(variation_option)
      .values({ variation_id, value }).returning();

    return sendResponse(
      c,
      201,
      true,
      "Variation option added successfully",
      option
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to add variation option",
      null,
      error
    );
  }
};

export const updateVariationOption = async (c: Context) => {
  try {
    const { id, value } = await c.req.json();
    if (!id || !value)
      return sendResponse(
        c,
        400,
        false,
        "Option ID and value are required",
        null
      );

    const normalizedValue = value.toUpperCase();

    // Check duplicate
      const duplicate = await db
          .select()
          .from(variation_option)
          .where(eq(variation_option.value, normalizedValue) && ne(variation_option.id, id));

    if (duplicate.length > 0)
      return sendResponse(c, 409, false, "Option value already exists", null);

    const updated = await db
      .update(variation_option)
      .set({ value: normalizedValue })
      .where(eq(variation_option.id, id));

    if (!updated.count)
      return sendResponse(c, 404, false, "Variation option not found", null);

    return sendResponse(
      c,
      200,
      true,
      "Variation option updated successfully",
      updated
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to update variation option",
      null,
      error
    );
  }
};
export const deleteVariationOption = async (c: Context) => {
  try {
    const { id } = await c.req.json();
    if (!id) return sendResponse(c, 400, false, "Option ID is required", null);

    const deleted = await db
      .delete(variation_option)
      .where(eq(variation_option.id, id));

    if (!deleted || deleted.count === 0)
      return sendResponse(c, 404, false, "Variation option not found", null);

    return sendResponse(
      c,
      200,
      true,
      "Variation option deleted successfully"
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to delete variation option",
      null,
      error
    );
  }
};

export const getVariationOptions = async (c: Context) => {
  try {
    const { variation_id } = await c.req.json();

    const options = variation_id
      ? await db
          .select()
          .from(variation_option)
          .where(eq(variation_option.variation_id, variation_id))
      : await db.select().from(variation_option);

    return sendResponse(
      c,
      200,
      true,
      "Variation options fetched successfully",
      options
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to fetch variation options",
      null,
      error
    );
  }
};
