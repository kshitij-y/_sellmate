import type { Context } from "hono";
import { getDb, store, eq } from "@sellmate/db";
import { sendResponse } from "../utils/response.js";
import cloudinary from "@kshitij_npm/sell_upload";
import { getDataUri } from "@kshitij_npm/sell_upload";
const db = getDb();


const getUrl = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileData = {
    originalname: file.name,
    buffer,
  };

  const fileUri = getDataUri(fileData);
  
  if (typeof fileUri.content !== "string") {
    throw new Error("Invalid fileUri.content: must be a string");
  }
  const result = await cloudinary.uploader.upload(fileUri.content, {
    folder: "hono_uploads",
    transformation: { width: 800, crop: "scale" },
  });

  return result.secure_url;
};


export const createStore = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;
    const formData = await c.req.formData();

    const name = formData.get("name") as string | null;
    const desc = formData.get("desc") as string | null;
    const cover_file = formData.get("cover_file") as File | null;
    const logo_file = formData.get("logo_file") as File | null;

    if (!name || typeof name !== "string") {
      return sendResponse(c, 400, false, "Invalid store name");
    }

    if (!cover_file || !logo_file) {
      return sendResponse(c, 400, false, "Missing cover or logo file");
    }

    // Upload images to Cloudinary
    const [cover_url, logo_url] = await Promise.all([
      getUrl(cover_file),
      getUrl(logo_file),
    ]);

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
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;
    const formData = await c.req.formData();

    const store_id = formData.get("store_id") as string | null;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const logo_file = formData.get("logo_file") as File | null;
    const cover_file = formData.get("cover_file") as File | null;

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

    if (name !== null) updateData.name = name;
    if (description !== null) updateData.description = description;
    if (logo_file) updateData.logo_url = await getUrl(logo_file);
    if (cover_file) updateData.cover_url = await getUrl(cover_file);

    updateData.updated_at = new Date();

    if (Object.keys(updateData).length === 1) {
      return sendResponse(c, 400, false, "No update fields provided");
    }

    const [updatedStore] = await db
      .update(store)
      .set(updateData)
      .where(eq(store.id, store_id))
      .returning();

    return sendResponse(
      c,
      200,
      true,
      "Store updated successfully",
      updatedStore
    );
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