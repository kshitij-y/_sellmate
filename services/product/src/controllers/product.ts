import {
  getDb,
  store,
  product,
  product_config,
  product_image,
  product_item,
  eq,
} from "@kshitij_npm/sell_db";
import type { Context } from "hono";
import { sendResponse } from "../utils/response";
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

export const addProduct = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) {
      return sendResponse(c, 401, false, "User not authenticated");
    }
    const user_id = user.id;

    const { name, description, category_id, store_id } = await c.req.json();

    if (!name || !description || !category_id || !store_id) {
      return sendResponse(c, 400, false, "All fields are required");
    }

    const storeRes = await db
      .select()
      .from(store)
      .where(eq(store.id, store_id) && eq(store.owner_id, user_id));

    if (storeRes.length === 0) {
      return sendResponse(c, 403, false, "Store does not belong to the user");
    }

    const newProduct = await db.insert(product).values({
      name,
      description,
      category_id,
      store_id,
    });

    return sendResponse(c, 201, true, "Product added successfully", newProduct);
  } catch (error) {
    console.error("addProduct error:", error);
    return sendResponse(c, 500, false, "Internal Server Error", null, error);
  }
};

export const getProducts = async (c: Context) => {
  try {
    const { id } = await c.req.json();

    const products = id
      ? await db.select().from(product).where(eq(product.id, id))
      : await db.select().from(product);

    return sendResponse(
      c,
      200,
      true,
      "Products fetched successfully",
      products
    );
  } catch (error) {
    console.error("getProducts error:", error);
    return sendResponse(c, 500, false, "Failed to fetch products", null, error);
  }
};

export const updateProduct = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) {
      return sendResponse(c, 401, false, "User not authenticated");
    }
    const user_id = user.id;

    const { id, name, description, category_id, store_id } = await c.req.json();

    if (!id || !name || !description || !category_id || !store_id) {
      return sendResponse(c, 400, false, "All fields are required");
    }

    // Check if the store belongs to the user
    const storeRes = await db
      .select()
      .from(store)
      .where(eq(store.id, store_id) && eq(store.owner_id, user_id));

    if (storeRes.length === 0) {
      return sendResponse(c, 403, false, "Store does not belong to the user");
    }

    const updated = await db
      .update(product)
      .set({
        name,
        description,
        category_id,
        store_id,
      })
      .where(eq(product.id, id));

    if (!updated.count) {
      return sendResponse(c, 404, false, "Product not found", null);
    }

    return sendResponse(c, 200, true, "Product updated successfully", updated);
  } catch (error) {
    console.error("updateProduct error:", error);
    return sendResponse(c, 500, false, "Failed to update product", null, error);
  }
};

export const deleteProduct = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user?.id) {
      return sendResponse(c, 401, false, "User not authenticated");
    }
    const user_id = user.id;

    const { id } = await c.req.json();
    if (!id) return sendResponse(c, 400, false, "Product ID is required");

    const prodRes = await db.select().from(product).where(eq(product.id, id));
    if (prodRes.length === 0) {
      return sendResponse(c, 404, false, "Product not found");
    }

    const productItem = prodRes[0];

    const storeRes = await db
      .select()
      .from(store)
      .where(eq(store.id, productItem.store_id));
    if (storeRes.length === 0 || storeRes[0].owner_id !== user_id) {
      return sendResponse(c, 403, false, "You do not own this store/product");
    }

    const deleted = await db.delete(product).where(eq(product.id, id));

    return sendResponse(c, 200, true, "Product deleted successfully", deleted);
  } catch (error) {
    console.error("deleteProduct error:", error);
    return sendResponse(c, 500, false, "Failed to delete product", null, error);
  }
};
