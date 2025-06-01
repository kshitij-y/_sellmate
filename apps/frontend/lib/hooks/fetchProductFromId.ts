import { fetcher } from "../TanStack-Query/api"
import ApiResponse from "../types/apiResponse"
import Product from "../types/product"
import { toast } from "sonner";

export const fetchProductFromId = async (id: string) => {
    try {
        const result = await fetcher<ApiResponse<Product>>(
          `/api/product/byId/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if(!result.success){
            toast.error("No product found")
            return null;
        }

      console.log("fetching -> ", result);
        return result.data;
    } catch (error){
        console.error(error);
        return null;
    }
}