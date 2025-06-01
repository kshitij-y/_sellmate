"use server";

import { addAddress, updateAddress } from "@/lib/server/address";
import { revalidatePath } from "next/cache";

export async function addAddressAction(_: any, formData: FormData) {
  try {
    const payload = {
      country: formData.get("country") as string,
      state: formData.get("state") as string | undefined,
      city: formData.get("city") as string,
      phone: formData.get("phone") as string,
      postal_code: formData.get("postal_code") as string | undefined,
      address: formData.get("address") as string,
    };

    await addAddress(payload);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateAddressAction(_: any, formData: FormData) {
  try {
    const payload = {
      country: formData.get("country") as string,
      state: formData.get("state") as string | undefined,
      city: formData.get("city") as string,
      phone: formData.get("phone") as string,
      postal_code: formData.get("postal_code") as string | undefined,
      address: formData.get("address") as string,
    };

    await updateAddress(payload);
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
