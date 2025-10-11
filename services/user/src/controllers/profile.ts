import { getDb, eq, user, userProfile } from "@kshitij_npm/sell_db";
import { Context } from "hono";
import { sendResponse } from "../utils/response.js";
const db = getDb();

export const getFullUserProfile = async (c: Context) => {
    try {
        const authUser = c.get("user");
        if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

        const userId = authUser.id;

        // Check if profile exists
        const checkProfile = await db
            .select()
            .from(userProfile)
            .where(eq(userProfile.userId, userId));

        // If not, create one
        if (checkProfile.length === 0) {
            await db.insert(userProfile).values({
                id: crypto.randomUUID(),
                userId,
                phone: null,
                address: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Fetch full profile with join
        const result = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                userCreatedAt: user.createdAt,
                userUpdatedAt: user.updatedAt,
                profileId: userProfile.id,
                phone: userProfile.phone,
                address: userProfile.address,
                rating: userProfile.rating,
                profileCreatedAt: userProfile.createdAt,
                profileUpdatedAt: userProfile.updatedAt,
            })
            .from(user)
            .leftJoin(userProfile, eq(user.id, userProfile.userId))
            .where(eq(user.id, userId))
            .limit(1);

        if (!result[0]) return sendResponse(c, 404, false, "User not found");

        return sendResponse(
            c,
            200,
            true,
            "User profile fetched successfully",
            result[0]
        );
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return sendResponse(c, 500, false, "Failed to fetch user profile");
    }
};

// export const updateUser= async (c: Context) => {
//   try {
//     const _user = c.get("user");
//     if (!_user) {
//       return sendResponse(c, 401, false, "Unauthorized: User not found");
//     }

//     const userId = _user.id;

//     const body = await c.req.json();
//     const { name, image } = body;

//     if (!name && !image) {
//       return sendResponse(c, 400, false, "No fields provided for update");
//     }

//     const updatedFields = {
//       ...(name && { name }),
//       ...(image && { image }),
//       updatedAt: new Date(),
//     };

//     const result = await db
//       .update(user)
//       .set(updatedFields)
//       .where(eq(user.id, userId))
//       .returning();

//     return sendResponse(
//       c,
//       200,
//       true,
//       "User profile updated successfully",
//       result[0]
//     );
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     return sendResponse(c, 500, false, "Failed to update user profile");
//   }
// };

// export const updateUserProfile = async (c: Context) => {
//   try {
//     const authUser = c.get("user");
//     const userId = authUser.id;

//     const body = await c.req.json();
//     const { phone, address } = body;

//     const updatedProfile = await db
//       .update(userProfile)
//       .set({
//         phone: phone || null,
//         address: address || null,
//         updatedAt: new Date(),
//       })
//       .where(eq(userProfile.userId, userId))
//       .returning();

//     if (!updatedProfile[0]) {
//       return sendResponse(c, 404, false, "User profile not found");
//     }

//     return sendResponse(
//       c,
//       200,
//       true,
//       "User profile updated",
//       updatedProfile[0]
//     );
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     return sendResponse(c, 500, false, "Failed to update user profile");
//   }
// };

// export const addUserProfile = async (c: Context) => {
//   try {
//     const _user = c.get("user");
//     const userId = _user.id;

//     const existingProfile = await db
//       .select()
//       .from(userProfile)
//       .where(eq(userProfile.userId, userId));

//     if (existingProfile.length > 0) {
//       return sendResponse(c, 400, false, "Profile already exists");
//     }

//     const body = await c.req.json();
//     const { phone, address } = body;

//     if (!phone || !address)
//       return sendResponse(c, 400, false, "phone or adress missing");

//     const newProfile = await db
//       .insert(userProfile)
//       .values({
//         id: crypto.randomUUID(),
//         userId,
//         phone: phone,
//         address: address,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     return sendResponse(c, 200, true, "User profile created", newProfile[0]);
//   } catch (error) {
//     console.error("Error creating user profile:", error);
//     return sendResponse(c, 500, false, "Failed to create user profile");
//   }
// };

export const updateUserAndProfile = async (c: Context) => {
    try {
        const authUser = c.get("user");
        if (!authUser) {
            return sendResponse(c, 401, false, "Unauthorized: User not found");
        }

        const userId = authUser.id;
        const body = await c.req.json();
        const { name, image, phone, address } = body;

        if (!name && !image && !phone && !address) {
            return sendResponse(c, 400, false, "No fields provided for update");
        }

        // Collect update promises
        const promises: Promise<any>[] = [];

        // Update main user table (if needed)
        if (name || image) {
            const updatedUser = db
                .update(user)
                .set({
                    ...(name && { name }),
                    ...(image && { image }),
                    updatedAt: new Date(),
                })
                .where(eq(user.id, userId))
                .returning();
            promises.push(updatedUser);
        }

        // Update user profile table (if needed)
        if (phone || address) {
            const updatedProfile = db
                .update(userProfile)
                .set({
                    ...(phone && { phone }),
                    ...(address && { address }),
                    updatedAt: new Date(),
                })
                .where(eq(userProfile.userId, userId))
                .returning();
            promises.push(updatedProfile);
        }

        // Execute in parallel
        const results = await Promise.all(promises);

        return sendResponse(
            c,
            200,
            true,
            "User and/or profile updated successfully",
            {
                user: results[0]?.[0] || null,
                profile: results[1]?.[0] || null,
            }
        );
    } catch (error) {
        console.error("Error updating user/profile:", error);
        return sendResponse(c, 500, false, "Failed to update user/profile");
    }
};

export const getUserAddress = async (c: Context) => {
    try {
        const authUser = c.get("user");
        if (!authUser) return sendResponse(c, 401, false, "Unauthorized");

        const result = await db
            .select({ address: userProfile.address })
            .from(userProfile)
            .where(eq(userProfile.userId, authUser.id))
            .limit(1);

        if (!result[0]) return sendResponse(c, 404, false, "Address not found");

        return sendResponse(
            c,
            200,
            true,
            "User address fetched successfully",
            result[0].address
        );
    } catch (error) {
        console.error("Error fetching user address:", error);
        return sendResponse(c, 500, false, "Failed to fetch user address");
    }
};
