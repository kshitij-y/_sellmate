import {
  getDb,
  store,
  product,
  product_item,
  eq,
  ne,
  sql,
  product_config,
  product_image,
  variation,
  variation_option,
} from "@kshitij_npm/sell_db";
import type { Context } from "hono";
import { sendResponse } from "../utils/response";

const db = getDb();


export const addProductItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) return sendResponse(c, 401, false, "User not authenticated");

    let { product_id, sku, quantity, price, variation_option_id, images } =
      await c.req.json();

    if (
      !product_id ||
      !sku ||
      quantity == null ||
      price == null ||
      !variation_option_id ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return sendResponse(
        c,
        400,
        false,
        "All fields including images and variations are required"
      );
    }

    sku = sku.toUpperCase();

    // Ownership check
    const ownership = await db.execute(
      sql`
        SELECT p.id
        FROM ${product} p
        JOIN ${store} s ON p.store_id = s.id
        WHERE p.id = ${product_id} AND s.owner_id = ${user.id}
      `
    );

    if (ownership.rows.length === 0) {
      return sendResponse(c, 403, false, "You do not own this product");
    }

    // Duplicate SKU check
    const existing = await db
      .select()
      .from(product_item)
      .where(eq(product_item.sku, sku));
    if (existing.length > 0)
      return sendResponse(c, 409, false, "SKU already exists");

    // Insert product item
    const [item] = await db
      .insert(product_item)
      .values({ product_id, sku, quantity, price })
      .returning();

    // Insert variations (can be multiple)
    if (!Array.isArray(variation_option_id))
      variation_option_id = [variation_option_id];
    const configs = variation_option_id.map((vid: string) => ({
      product_item_id: item.id,
      variation_option_id: vid,
    }));
    await db.insert(product_config).values(configs);

    // Insert images
    const imageRows = images.map((url: string, idx: number) => ({
      product_item_id: item.id,
      image_url: url,
      position: idx + 1,
    }));
    await db.insert(product_image).values(imageRows);

    return sendResponse(c, 201, true, "Product item added successfully", item);
  } catch (error) {
    console.error("addProductItem error:", error);
    return sendResponse(
      c,
      500,
      false,
      "Failed to add product item",
      null,
      error
    );
  }
};


export const getProductItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) return sendResponse(c, 401, false, "User not authenticated");

    const { product_id, id } = await c.req.json();

    let query = sql`
      SELECT 
        pi.*, 
        json_agg(DISTINCT jsonb_build_object(
          'id', vo.id,
          'variation', v.name,
          'value', vo.value
        )) FILTER (WHERE vo.id IS NOT NULL) AS variations,
        json_agg(DISTINCT jsonb_build_object(
          'id', img.id,
          'image_url', img.image_url,
          'position', img.position
        )) FILTER (WHERE img.id IS NOT NULL) AS images
      FROM ${product_item} pi
      JOIN ${product} p ON pi.product_id = p.id
      JOIN ${store} s ON p.store_id = s.id
      LEFT JOIN ${product_config} pc ON pi.id = pc.product_item_id
      LEFT JOIN ${variation_option} vo ON pc.variation_option_id = vo.id
      LEFT JOIN ${variation} v ON vo.variation_id = v.id
      LEFT JOIN ${product_image} img ON pi.id = img.product_item_id
      WHERE s.owner_id = ${user.id}
    `;

    if (id) query = sql`${query} AND pi.id = ${id}`;
    if (product_id) query = sql`${query} AND pi.product_id = ${product_id}`;
    query = sql`${query} GROUP BY pi.id`;

    const items = await db.execute(query);

    return sendResponse(
      c,
      200,
      true,
      "Product items fetched successfully",
      items.rows
    );
  } catch (error) {
    console.error("getProductItems error:", error);
    return sendResponse(
      c,
      500,
      false,
      "Failed to fetch product items",
      null,
      error
    );
  }
};


export const patchProductItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) return sendResponse(c, 401, false, "User not authenticated");

    let { id, sku, quantity, price, variation_option_id, images } =
      await c.req.json();

    if (!id) return sendResponse(c, 400, false, "Product item ID is required");

    // Ownership check
    const ownership = await db.execute(sql`
      SELECT pi.id
      FROM ${product_item} pi
      JOIN ${product} p ON pi.product_id = p.id
      JOIN ${store} s ON p.store_id = s.id
      WHERE pi.id = ${id} AND s.owner_id = ${user.id}
    `);

    if (ownership.rows.length === 0)
      return sendResponse(c, 403, false, "You do not own this product item");

    const updateData: Record<string, any> = {};

    if (sku) {
      sku = sku.toUpperCase();
      const duplicate = await db
        .select()
        .from(product_item)
        .where(eq(product_item.sku, sku) && ne(product_item.id, id));
      if (duplicate.length > 0)
        return sendResponse(c, 409, false, "SKU already exists");
      updateData.sku = sku;
    }

    if (quantity != null) updateData.quantity = quantity;
    if (price != null) updateData.price = price;

    if (Object.keys(updateData).length > 0) {
      await db
        .update(product_item)
        .set(updateData)
        .where(eq(product_item.id, id));
    }

    if (variation_option_id) {
      if (!Array.isArray(variation_option_id))
        variation_option_id = [variation_option_id];

      await db
        .delete(product_config)
        .where(eq(product_config.product_item_id, id));

      const configs = variation_option_id.map((vid: string) => ({
        product_item_id: id,
        variation_option_id: vid,
      }));
      await db.insert(product_config).values(configs);
    }

    if (images && Array.isArray(images)) {
      await db
        .delete(product_image)
        .where(eq(product_image.product_item_id, id));

      const imageRows = images.map((url: string, idx: number) => ({
        product_item_id: id,
        image_url: url,
        position: idx + 1,
      }));
      await db.insert(product_image).values(imageRows);
    }

    return sendResponse(c, 200, true, "Product item updated successfully");
  } catch (error) {
    console.error("patchProductItem error:", error);
    return sendResponse(
      c,
      500,
      false,
      "Failed to update product item",
      null,
      error
    );
  }
};


export const deleteProductItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) return sendResponse(c, 401, false, "User not authenticated");

    const { id } = await c.req.json();
    if (!id) return sendResponse(c, 400, false, "Product item ID is required");

    const ownership = await db.execute(sql`
      SELECT pi.id
      FROM ${product_item} pi
      JOIN ${product} p ON pi.product_id = p.id
      JOIN ${store} s ON p.store_id = s.id
      WHERE pi.id = ${id} AND s.owner_id = ${user.id}
    `);

    if (ownership.rows.length === 0)
      return sendResponse(c, 403, false, "You do not own this product item");

    await db
      .delete(product_config)
      .where(eq(product_config.product_item_id, id));
    await db.delete(product_image).where(eq(product_image.product_item_id, id));
    const deleted = await db
      .delete(product_item)
      .where(eq(product_item.id, id));

    return sendResponse(
      c,
      200,
      true,
      "Product item deleted successfully",
      deleted
    );
  } catch (error) {
    console.error("deleteProductItem error:", error);
    return sendResponse(
      c,
      500,
      false,
      "Failed to delete product item",
      null,
      error
    );
  }
};
