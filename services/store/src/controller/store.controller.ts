import type { Context } from "hono";
import { getDb, store, eq } from "@sellmate/db";
import { sendResponse } from "../utils/response.js";

const db = getDb();

export const createStore = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;
    const body = await c.req.json();
    const { name, desc, cover_url, logo_url } = body;

    if (!name || typeof name !== "string") {
      return sendResponse(c, 400, false, "Invalid store name");
    }

    const [newStore] = await db
      .insert(store)
      .values({
        name,
        description: desc,
        cover_url,
        logo_url,
        owner_id: user_id,
      })
      .returning();

    return sendResponse(c, 201, true, "Store created successfully", {
      store: newStore,
    });
  } catch (error) {
    console.error("Create store error:", error);
    return sendResponse(c, 500, false, "Internal Server Error");
  }
};

export const getById = async (c: Context) => {
  try {
    const user = c.get("user");
    const user_id = user.id;

    const store_id = c.req.query("store_id");
    if (!store_id) {
      return sendResponse(c, 400, false, "Missing store_id");
    }

    const res = await db.select().from(store).where(eq(store.id, store_id));

    if (res.length === 0) {
      return sendResponse(c, 404, false, "Store not found");
    }

    return sendResponse(c, 200, true, "Store found", res[0]);
  } catch (error) {
    console.error("Create store error:", error);
    return sendResponse(c, 500, false, "Internal Server Error");
  }
};

export const updateStore = async (c: Context) => {
  try {
    const user = c.get("user");
    const user_id = user.id;

    const { store_id, name, description, logo_url, cover_url } =
      await c.req.json();

    if (!store_id) {
      return sendResponse(c, 400, false, "Missing store_id");
    }

    const result = await db.select().from(store).where(eq(store.id, store_id));

    if (result.length === 0) {
      return sendResponse(c, 404, false, "Store not found");
    }

    const existingStore = result[0];

    if (existingStore.owner_id !== user_id) {
      return sendResponse(
        c,
        403,
        false,
        "You are not allowed to update this store"
      );
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (cover_url !== undefined) updateData.cover_url = cover_url;
    updateData.updated_at = new Date();

    if (Object.keys(updateData).length === 1) {
      return sendResponse(c, 400, false, "No update fields provided");
    }

    const [res] = await db.update(store).set(updateData).where(eq(store.id, store_id)).returning();

    return sendResponse(c, 200, true, "Store updated successfully", res);
  } catch (error) {
    console.error("Update store error:", error);
    return sendResponse(c, 500, false, "Internal Server Error");
  }
};

export const deleteStore = async (c: Context) => {
  try {
    const user = c.get("user");
    const user_id = user.id;

    const { store_id } = await c.req.json();
    if (!store_id) {
      return sendResponse(c, 400, false, "Missing store_id");
    }

    const result = await db.select().from(store).where(eq(store.id, store_id));

    if (result.length === 0) {
      return sendResponse(c, 404, false, "Store not found");
    }

    const existingStore = result[0];

    if (existingStore.owner_id !== user_id) {
      return sendResponse(
        c,
        403,
        false,
        "You are not allowed to delete this store"
      );
    }

    await db.delete(store).where(eq(store.id, store_id));

    return sendResponse(c, 200, true, "Store deleted successfully");
  } catch (error) {
    console.error("Delete store error:", error);
    return sendResponse(c, 500, false, "Internal Server Error");
  }
};