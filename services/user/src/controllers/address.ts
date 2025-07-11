import { address, user_address, eq, and, ne, getDb } from "@sellmate/db";
import { Context } from "hono";
import { sendResponse } from "../utils/response.js";
import { v4 as uuidv4 } from "uuid";

const db = getDb();

export const getAddress = async (c: Context) => {
  try {
    const user = c.get("user");

    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;

    const def_address = await db
      .select({
        id: address.id,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city: address.city,
        phone: address.phone,
        pin_code: address.pin_code,
        country: address.country,
        is_default: user_address.default,
      })
      .from(user_address)
      .innerJoin(address, eq(user_address.address_id, address.id))
      .where(eq(user_address.user_id, user_id));

    if (def_address.length === 0) {
      return sendResponse(c, 200, true, "No address found for this user", []);
    }

    return sendResponse(
      c,
      200,
      true,
      "Address retrieved successfully",
      def_address
    );
  } catch (error) {
    console.error("Error retrieving address:", error);
    return sendResponse(c, 500, false, "Failed to retrieve address");
  }
};

export const addAddress = async (c: Context) => {
  try {
    const user = c.get("user");

    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;
    const body = await c.req.json();

    const {
      address_line1,
      address_line2,
      city,
      phone,
      pin_code,
      country,
      is_default = false,
    } = body;

    if (!address_line1 || !city || !pin_code || !country || !phone) {
      return sendResponse(c, 400, false, "Missing required fields");
    }

    const newAddressId = uuidv4();
    await db.insert(address).values({
      id: newAddressId,
      address_line1,
      address_line2,
      city,
      phone,
      pin_code,
      country,
    });

    if (is_default) {
      await db
        .update(user_address)
        .set({ default: false })
        .where(eq(user_address.user_id, user_id));
    }

    await db.insert(user_address).values({
      user_id,
      address_id: newAddressId,
      default: is_default,
    });

    return sendResponse(c, 201, true, "Address added successfully");
  } catch (error) {
    console.error("Error adding address:", error);
    return sendResponse(c, 500, false, "Failed to add address");
  }
};

export const updateAddress = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;
    const body = await c.req.json();
    const address_id = body.address_id;

    if (!address_id) {
      return sendResponse(c, 400, false, "Missing address_id");
    }

    const isUserAddress = await db
      .select()
      .from(user_address)
      .where(
        and(
          eq(user_address.user_id, user_id),
          eq(user_address.address_id, address_id)
        )
      );

    if (isUserAddress.length === 0) {
      return sendResponse(
        c,
        403,
        false,
        "You are not authorized to update this address"
      );
    }

    const updateFields: Record<string, any> = {};
    if (body.address_line1) updateFields.address_line1 = body.address_line1;
    if (body.address_line2) updateFields.address_line2 = body.address_line2;
    if (body.city) updateFields.city = body.city;
    if (body.phone) updateFields.phone = body.phone;
    if (body.pin_code) updateFields.pin_code = body.pin_code;
    if (body.country) updateFields.country = body.country;

    if (Object.keys(updateFields).length > 0) {
      await db
        .update(address)
        .set(updateFields)
        .where(eq(address.id, address_id));
    }

    if (typeof body.is_default === "boolean") {
      if (body.is_default) {
        // Unset other default addresses for this user
        await db
          .update(user_address)
          .set({ default: false })
          .where(
            and(
              eq(user_address.user_id, user_id),
              ne(user_address.address_id, address_id)
            )
          );
      }

      // Set is_default for current address
      await db
        .update(user_address)
        .set({ default: body.is_default })
        .where(
          and(
            eq(user_address.user_id, user_id),
            eq(user_address.address_id, address_id)
          )
        );
    }

    return sendResponse(c, 200, true, "Address updated successfully");
  } catch (error) {
    console.error("Error updating address:", error);
    return sendResponse(c, 500, false, "Failed to update address");
  }
};

export const deleteAddress = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;
    const { address_id } = await c.req.json();

    if (!address_id) {
      return sendResponse(c, 400, false, "Missing address_id");
    }

    const existing = await db
      .select()
      .from(user_address)
      .where(
        and(
          eq(user_address.user_id, user_id),
          eq(user_address.address_id, address_id)
        )
      );

    if (existing.length === 0) {
      return sendResponse(
        c,
        403,
        false,
        "You are not authorized to delete this address"
      );
    }

    const wasDefault = existing[0].default;

    await db
      .delete(user_address)
      .where(
        and(
          eq(user_address.user_id, user_id),
          eq(user_address.address_id, address_id)
        )
      );

    await db.delete(address).where(eq(address.id, address_id));

    if (wasDefault) {
      const remainingAddresses = await db
        .select()
        .from(user_address)
        .where(eq(user_address.user_id, user_id));

      if (remainingAddresses.length > 0) {
        await db
          .update(user_address)
          .set({ default: true })
          .where(
            and(
              eq(user_address.user_id, user_id),
              eq(user_address.address_id, remainingAddresses[0].address_id)
            )
          );
      }
    }

    return sendResponse(c, 200, true, "Address deleted successfully");
  } catch (error) {
    console.error("Error deleting address:", error);
    return sendResponse(c, 500, false, "Failed to delete address");
  }
};

export const getdefaultAddress = async (c: Context) => {
  try {
    const user = c.get("user");

    if (!user) {
      return sendResponse(c, 401, false, "Unauthorized: User not found");
    }

    const user_id = user.id;

    const defaultAddress = await db
      .select({
        id: address.id,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city: address.city,
        phone: address.phone,
        pin_code: address.pin_code,
        country: address.country,
      })
      .from(user_address)
      .innerJoin(address, eq(user_address.address_id, address.id))
      .where(
        and(eq(user_address.user_id, user_id), eq(user_address.default, true))
      );

    if (defaultAddress.length === 0) {
      return sendResponse(c, 200, true, "No default address found", []);
    }

    return sendResponse(
      c,
      200,
      true,
      "Default address retrieved successfully",
      defaultAddress[0]
    );
  } catch (error) {
    console.error("Error retrieving default address:", error);
    return sendResponse(c, 500, false, "Failed to retrieve default address");
  }
};