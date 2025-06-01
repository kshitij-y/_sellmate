import { toast } from "sonner";

const BE_URL = process.env.BE_URL;

export const API_URL = BE_URL || "http://localhost:3000";

export const fetcher = async <T = unknown>(
  endpoint: string,
  options = {}
): Promise<T> => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const response: T = await res.json(); // Properly casting the response

    if (!res.ok || (response as any)?.success === false) {
      throw new Error((response as any)?.message || "Something went wrong");
    }
    console.log(response);
    return response;
  } catch (error: any) {
    console.log("API Error:", error.message);
    toast.error("API Error:", error.message);
    throw error;
  }
};
