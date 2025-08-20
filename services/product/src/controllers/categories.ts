import { getDb, category, eq } from "@kshitij_npm/sell_db";
import { Context } from "hono";
import { sendResponse } from "../utils/response";
import { asc } from "drizzle-orm";

const db = getDb();

export const getCategories = async (c: Context) => {
  try {
    const categories = await db
      .select()
      .from(category)
      .orderBy(asc(category.cat_name));

    const hierarchicalCategories = buildCategoryTree(categories);

    return sendResponse(c, 200, true, "Categories fetched successfully",
      hierarchicalCategories,
    );
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to fetch categories",
      null,
      error
    );
  }
};

type Category = {
  id: string;
  parent_cat_id: string | null;
  cat_name: string;
  children?: Category[];
};

function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<string, Category>();
  const roots: Category[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    if (cat.parent_cat_id) {
      const parent = map.get(cat.parent_cat_id);
      if (parent) {
        parent.children!.push(map.get(cat.id)!);
      }
    } else {
      roots.push(map.get(cat.id)!);
    }
  });

  return roots;
}


export const addCategories = async (c: Context) => {
  try {
    const { parent_cat_id, cat_name } = await c.req.json();

    if (!cat_name) {
      return sendResponse(c, 400, false, "Category name required", null);
    }

    const cat = await db.insert(category).values({
      parent_cat_id,
      cat_name,
    });

    return sendResponse(c, 201, true, "Category added successfully", cat);
  } catch (error) {
    return sendResponse(c, 500, false, "Failed to add category", null, error);
  }
};

export const deleteCategory = async (c: Context) => {
  try {
    const { id } = await c.req.json();

    if (!id) {
      return sendResponse(c, 400, false, "Category ID is required", null);
    }

    const deleted = await db.delete(category).where(eq(category.id, id));

    if (!deleted.count) {
      return sendResponse(c, 404, false, "Category not found", null);
    }

    return sendResponse(c, 200, true, "Category deleted successfully", deleted);
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to delete category",
      null,
      error
    );
  }
};
export const updateCategory = async (c: Context) => {
  try {
    const { id, cat_name, parent_cat_id } = await c.req.json();

    if (!id) {
      return sendResponse(c, 400, false, "Category ID is required", null);
    }

    const updated = await db
      .update(category)
      .set({ cat_name, parent_cat_id })
      .where(eq(category.id, id));

    if (!updated.count) {
      return sendResponse(c, 404, false, "Category not found", null);
    }

    return sendResponse(c, 200, true, "Category updated successfully", updated);
  } catch (error) {
    return sendResponse(
      c,
      500,
      false,
      "Failed to update category",
      null,
      error
    );
  }
};
