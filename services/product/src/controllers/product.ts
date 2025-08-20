import {
  getDb,
  store,
  product,
  product_config,
  product_image,
  product_item,
  eq,
} from "@sellmate/db";
import type { Context } from "hono";
import { sendResponse } from "../utils/response";
import cloudinary from "@sellmate/upload";
import { getDataUri } from "@sellmate/upload";
import { v4 as uuid4 } from "uuid";

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
    const user_id = user.id;
    const formData = await c.req.formData();

    const store_id = formData.get("store_id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category_id = formData.get("category_id") as string;
    const itemsJson = formData.get("items") as string;

    const items: Array<{
      sku: string;
      quantity: number;
      price: string;
      config: string[];
      images: Array<{ position: number; fileKey: string }>;
    }> = JSON.parse(itemsJson);

    const stores = await db.select().from(store).where(eq(store.id, store_id));
    if (stores.length === 0) {
      return sendResponse(c, 404, false, "Store not found");
    }
    if (stores[0].owner_id !== user_id) {
      return sendResponse(c, 403, false, "Forbidden: Not the store owner");
    } // Insert Product and all related data in a transaction

    await db.transaction(async (tx) => {
      // Insert product
      const [insertProduct] = await tx
        .insert(product)
        .values({
          name,
          description,
          category_id, // Just use as is, it's the id
          store_id,
        })
        .returning(); // For each item (SKU)

      for (const item of items) {
        const [insertedItem] = await tx
          .insert(product_item)
          .values({
            product_id: insertProduct.id,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
          })
          .returning(); // Insert all product_config records for each variation_option

        for (const variation_option_id of item.config || []) {
          await tx.insert(product_config).values({
            product_item_id: insertedItem.id,
            variation_option_id,
          });
        } // Process images

        for (const image of item.images) {
          const file = formData.get(image.fileKey);
          if (!(file instanceof File)) {
            throw new Error(`Invalid file for key: ${image.fileKey}`);
          }
          const imageUrl = await getUrl(file);
          await tx.insert(product_image).values({
            product_item_id: insertedItem.id,
            image_url: imageUrl,
            position: image.position,
          });
        }
      } // If you wish, you can return the newly created product id: // return insertProduct.id;
    });

    return sendResponse(c, 200, true, "Product added successfully");
  } catch (error) {
    console.error("addProduct error:", error);
    return sendResponse(c, 500, false, "Internal Server Error");
  }
};
