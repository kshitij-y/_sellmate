import { Context } from "hono";
import { getDb, store, eq, storeProducts } from "@kshitij_npm/sell_db";
import { sendResponse } from "../utils/response.js";
import crypto from "crypto";

const db = getDb();

// Create store (only 1 per user)
export const createStore = async (c: Context) => {
  try {
    const authUser = c.get("user");
    if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

    // Check if user already has a store
    const existing = await db.select().from(store).where(eq(store.ownerId, authUser.id));
    if (existing.length > 0) return sendResponse(c, 400, false, "You already have a store");

    const body = await c.req.json();
    const { name, description, logo, coverImage, category, location } = body;

    if (!name) return sendResponse(c, 400, false, "Store name is required");

    const newStore = await db
      .insert(store)
      .values({
        id: crypto.randomUUID(),
        ownerId: authUser.id,
        name,
        description: description || null,
        logo: logo || null,
        coverImage: coverImage || null,
        category: category || null,
        location: location || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return sendResponse(c, 200, true, "Store created successfully", newStore[0]);
  } catch (error) {
    console.error("Error creating store:", error);
    return sendResponse(c, 500, false, "Failed to create store");
  }
};

// Get store by owner
export const getStoreByOwner = async (c: Context) => {
  try {
    const ownerId = c.req.param("ownerId");
    if (!ownerId) return sendResponse(c, 400, false, "ownerId required");

    const stores = await db.select().from(store).where(eq(store.ownerId, ownerId));
    if (!stores.length) return sendResponse(c, 404, false, "Store not found");

    return sendResponse(c, 200, true, "Store fetched successfully", stores[0]);
  } catch (error) {
    console.error("Error fetching store:", error);
    return sendResponse(c, 500, false, "Failed to fetch store");
  }
};

// Update store
export const updateStore = async (c: Context) => {
  try {
    const storeId = c.req.param("storeId");
    const body = await c.req.json();

    const updated = await db
      .update(store)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(store.id, storeId))
      .returning();

    if (!updated.length) return sendResponse(c, 404, false, "Store not found");

    return sendResponse(c, 200, true, "Store updated", updated[0]);
  } catch (error) {
    console.error("Error updating store:", error);
    return sendResponse(c, 500, false, "Failed to update store");
  }
};

// Add product to store
export const addStoreProduct = async (c: Context) => {
  try {
    const storeId = c.req.param("storeId");
    const body = await c.req.json();
    const { name, description, price, stock, images, category } = body;

    if (!name || price === undefined)
      return sendResponse(c, 400, false, "Name and price are required");

    const product = await db
      .insert(storeProducts)
      .values({
        id: crypto.randomUUID(),
        storeId,
        name,
        description: description || null,
        price,
        stock: stock || 0,
        images: images || [],
        category: category || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return sendResponse(c, 200, true, "Product added successfully", product[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    return sendResponse(c, 500, false, "Failed to add product");
  }
};

// Get all products of a store
export const getStoreProducts = async (c: Context) => {
  try {
    const storeId = c.req.param("storeId");
    if (!storeId) return sendResponse(c, 400, false, "storeId required");

    const products = await db
      .select()
      .from(storeProducts)
      .where(eq(storeProducts.storeId, storeId));
    return sendResponse(c, 200, true, "Products fetched successfully", products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return sendResponse(c, 500, false, "Failed to fetch products");
  }
};

// Update product
export const updateStoreProduct = async (c: Context) => {
  try {
    const productId = c.req.param("productId");
    const body = await c.req.json();

    const updated = await db
      .update(storeProducts)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(storeProducts.id, productId))
      .returning();

    if (!updated.length) return sendResponse(c, 404, false, "Product not found");

    return sendResponse(c, 200, true, "Product updated", updated[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return sendResponse(c, 500, false, "Failed to update product");
  }
};
