"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../TanStack-Query/api";

import Product from "@/lib/types/product";
import ApiResponse from "@/lib/types/apiResponse";
import { toast } from "sonner";
import topSelling from "../types/topSelling";

interface Data<Product> {
  result: Product[];
  currentPage: string;
  totalPage: string;
  totalItems: string;
}
interface UpdateProductPayload {
  id: string;
  updateData: Partial<Product>;
}

export const useAllProducts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["allProducts", page, limit],
    queryFn: async () => {
      const response = await fetcher<ApiResponse<Data<Product>>>(
        `/api/product/allProducts?page=${page}&limit=${limit}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch products");
      }

      return response;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prevData) => prevData || undefined,
  });
};

export const useKeyWordSearch = (
  keyword: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["searchProducts", keyword, page, limit],
    queryFn: async () => {
      const response = await fetcher<ApiResponse<Product[]>>(
        `/api/product/keySearch?keyword=${keyword}&page=${page}&limit=${limit}`
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch products");
      }

      return response;
    },
    enabled: !!keyword,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prevData) => prevData || undefined,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: unknown) => {
      const response = await fetcher<ApiResponse<Product>>(
        `/api/user/products/addProduct`,
        {
          method: "POST",
          body: JSON.stringify({ product }),
          credentials: "include",
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to add product");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Addedproducts"] });
    },
    onError: (error) => {
      console.error("Error adding product:", error);
    },
  });
};

export const useShowMyProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetcher<ApiResponse<Product>>(
        `/api/user/products/showMyProducts`,
        {
          credentials: "include",
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch your product");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showMyProducts"] });
    },
    onError: (error) => {
      console.error("Error fetching your product:", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetcher<ApiResponse<Product>>(
        `/api/user/products/deleteProduct`,
        {
          method: "delete",
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to delete product");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletedProducts"] });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }: UpdateProductPayload) => {
      const response = await fetcher<ApiResponse<Product>>(
        `/api/user/products/updateProduct`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({ id, ...updateData }),
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to update product");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showMyProducts"] });
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });
};

export const useTopSelling = () => {
  return useQuery({
    queryKey: ["topselling"],
    queryFn: async () => {
      const response = await fetcher<ApiResponse<topSelling[]>>(
        `/api/product/getTopSelling`
      );

      if (response.success) {
        return response;
      } else {
        toast.error(response.error);
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (prevData) => prevData || undefined,
  });
};
