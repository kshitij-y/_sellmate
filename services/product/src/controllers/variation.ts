// import { getDb } from "@sellmate/db";
// import { variation, variation_option } from "@sellmate/db";
// import { Context } from "hono";
// import { sendResponse } from "../utils/response";
// import { eq, inArray } from "drizzle-orm";

// const db = getDb();

// export const getVariations = async (c: Context) => {
//   const catId = c.req.param("id");

//   console.log(`[getVariations] Fetching variations for category ID: ${catId}`);

//   try {
//     // Fetch variations for the category
//     const variations = await db
//       .select()
//       .from(variation)
//       .where(eq(variation.category_id, catId));

//     if (variations.length === 0) {
//       return sendResponse(
//         c,
//         404,
//         false,
//         "No variations found for this category",
//         []
//       );
//     }

//     const variationIds = variations.map((v) => v.id);

//     const options =
//       variationIds.length > 0
//         ? await db
//             .select()
//             .from(variation_option)
//             .where(inArray(variation_option.variation_id, variationIds))
//         : [];

//     // Map each variation and its options
//     const variationMap = new Map<
//       string,
//       { id: string; name: string; options: { id: string; value: string }[] }
//     >();

//     variations.forEach((v) => {
//       variationMap.set(v.id, { id: v.id, name: v.name, options: [] });
//     });

//     options.forEach((opt) => {
//       const v = variationMap.get(opt.variation_id);
//       if (v) v.options.push({ id: opt.id, value: opt.value });
//     });

//     const result = Array.from(variationMap.values());

//     return sendResponse(
//       c,
//       200,
//       true,
//       "Variations fetched successfully",
//       result
//     );
//   } catch (error) {
//     console.error("[getVariations] Error:", error);
//     return sendResponse(
//       c,
//       500,
//       false,
//       "Failed to fetch variations",
//       null,
//       error
//     );
//   }
// };
