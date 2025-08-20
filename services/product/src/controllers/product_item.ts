import {
  getDb,
  store,
  product,
  product_item,
  eq,
  ne,
  sql,
  product_config,
} from "@kshitij_npm/sell_db";
import type { Context } from "hono";
import { sendResponse } from "../utils/response";

const db = getDb();

export const addProductItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) return sendResponse(c, 401, false, "User not authenticated");

    let { product_id, sku, quantity, price, variation_option_id } =
      await c.req.json();
    if (
      !product_id ||
      !sku ||
      quantity == null ||
      price == null ||
      !variation_option_id
    ) {
      return sendResponse(c, 400, false, "All fields are required");
    }

    sku = sku.toUpperCase();

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

    const existing = await db
      .select()
      .from(product_item)
      .where(eq(product_item.sku, sku));
    if (existing.length > 0)
      return sendResponse(c, 409, false, "SKU already exists");

    const [item] = await db
      .insert(product_item)
      .values({ product_id, sku, quantity, price })
      .returning();

    const itemConfig = await db.insert(product_config).values({
      product_item_id: item.id,
      variation_option_id,
    });

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
      SELECT pi.*, json_agg(json_build_object(
        'variation_option_id', pc.variation_option_id
      )) AS variations
      FROM ${product_item} pi
      JOIN ${product} p ON pi.product_id = p.id
      JOIN ${store} s ON p.store_id = s.id
      LEFT JOIN ${product_config} pc ON pi.id = pc.product_item_id
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


export const updateProductItem = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) return sendResponse(c, 401, false, "User not authenticated");

    let { id, sku, quantity, price, variation_option_id } = await c.req.json();
    if (!id || !sku || quantity == null || price == null) {
      return sendResponse(c, 400, false, "All fields are required");
    }

    sku = sku.toUpperCase();
    if (variation_option_id && !Array.isArray(variation_option_id)) {
      variation_option_id = [variation_option_id];
    }

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

    // Duplicate SKU check
    const duplicate = await db
      .select()
      .from(product_item)
      .where(eq(product_item.sku, sku) && ne(product_item.id, id));
      
    if (duplicate.length > 0)
      return sendResponse(c, 409, false, "SKU already exists");

    // Update product item
    const updated = await db
      .update(product_item)
      .set({ sku, quantity, price })
      .where(eq(product_item.id, id));

    if (variation_option_id) {
      await db
        .delete(product_config)
        .where(eq(product_config.product_item_id, id));

      const configs = variation_option_id.map((vid: string) => ({
        product_item_id: id,
        variation_option_id: vid,
      }));
      await db.insert(product_config).values(configs);
    }

    return sendResponse(
      c,
      200,
      true,
      "Product item updated successfully",
      updated
    );
  } catch (error) {
    console.error("updateProductItem error:", error);
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

    // Delete product configs first
    await db
      .delete(product_config)
      .where(eq(product_config.product_item_id, id));

    // Delete product item
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

