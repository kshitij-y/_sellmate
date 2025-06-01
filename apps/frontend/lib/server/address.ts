"use server";

import { fetcher } from "@/lib/TanStack-Query/api";
import ApiResponse from "@/lib/types/apiResponse";
import Address from "@/lib/types/address";

export async function getAddress(): Promise<Address | null> {
  try {
    const res = await fetcher<ApiResponse<Address>>(
      "/api/user/address/getAddress",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.success) throw new Error(res.error || "Failed to fetch address");

    if (res.data) {
      return res.data;
    }
  } catch (err: any) {
    throw new Error(err.message || "Unknown error fetching address");
  }

  return null;
}

export async function addAddress(
  newAddress: Omit<Address, "id" | "user_id">
): Promise<void> {
  try {
    const res = await fetcher<ApiResponse<Address>>(
      "/api/user/address/addAddress",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
        credentials: "include",
      }
    );

    if (!res.success) throw new Error(res.error || "Failed to add address");
  } catch (err: any) {
    throw new Error(err.message || "Unknown error adding address");
  }
}

export async function updateAddress(
  updated: Omit<Address, "id" | "user_id">
): Promise<void> {
  try {
    const res = await fetcher<ApiResponse<Address>>(
      "/api/user/address/updateAddress",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
        credentials: "include",
      }
    );

    if (!res.success) throw new Error(res.error || "Failed to update address");
  } catch (err: any) {
    throw new Error(err.message || "Unknown error updating address");
  }
}
