// import { getDb, category } from "@sellmate/db";
// import { Context } from "hono";
// import { sendResponse } from "../utils/response";
// import { asc } from "drizzle-orm";

// const db = getDb();

// export const getCategories = async (c: Context) => {
//   try {
//     const categories = await db
//       .select()
//       .from(category)
//       .orderBy(asc(category.cat_name));

//     const hierarchicalCategories = buildCategoryTree(categories);

//     return sendResponse(c, 200, true, "Categories fetched successfully",
//       hierarchicalCategories,
//     );
//   } catch (error) {
//     return sendResponse(
//       c,
//       500,
//       false,
//       "Failed to fetch categories",
//       null,
//       error
//     );
//   }
// };

// type Category = {
//   id: string;
//   parent_cat_id: string | null;
//   cat_name: string;
//   children?: Category[];
// };

// function buildCategoryTree(categories: Category[]): Category[] {
//   const map = new Map<string, Category>();
//   const roots: Category[] = [];

//   categories.forEach((cat) => {
//     map.set(cat.id, { ...cat, children: [] });
//   });

//   categories.forEach((cat) => {
//     if (cat.parent_cat_id) {
//       const parent = map.get(cat.parent_cat_id);
//       if (parent) {
//         parent.children!.push(map.get(cat.id)!);
//       }
//     } else {
//       roots.push(map.get(cat.id)!);
//     }
//   });

//   return roots;
// }
