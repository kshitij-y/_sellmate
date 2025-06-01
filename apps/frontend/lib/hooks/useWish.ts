"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useCallback } from "react";
import { fetcher } from "../TanStack-Query/api";
import ApiResponse from "../types/apiResponse";
import { toast } from "sonner";
import { setWish, setLoading, setError } from "../store/Slices/wishSlice";
import wishItem from "../types/wishItems";
import { useCart } from "./useCart";

export const useWish = () => {
  const dispatch = useDispatch();
  const wishItems = useSelector((state: RootState) => state.wish.items);
  const loading = useSelector((state: RootState) => state.wish.loading);
  const error = useSelector((state: RootState) => state.wish.error);
  const { removeItem } = useCart();

  const fetchWish = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const result = await fetcher<ApiResponse<wishItem[]>>(
        `/api/user/wishlist/getWishlist`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (result.success) {
        if (result.data) {
          dispatch(setWish(result.data));
        } else {
          dispatch(setWish([]));
        }
      } else {
        throw new Error(result.message || "Failed to fetch wishList.");
      }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : String(error))
      );
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchWish();
  }, []);

  const reloadWishlist = async () => {
    await fetchWish();
  };

  const addToWishList = async (product: {
    product_id: string;
    title: string;
    price: number;
    image: string;
  }) => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<wishItem>>(
        `/api/user/wishlist/addwishlist`,
        {
          method: "POST",
          body: JSON.stringify(product),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.success) {
        if (result.data) {
          await reloadWishlist();
        } else {
          throw new Error("Invalid data received.");
        }
        toast.success("Product added to wishlist!");
      } else {
        throw new Error(result.message || "Failed to add product.");
      }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : String(error))
      );
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const moveToWishList = async (product: {
    product_id: string;
    title: string;
    price: number;
    image: string;
  }) => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<wishItem>>(
        `/api/user/wishlist/addwishlist`,
        {
          method: "POST",
          body: JSON.stringify(product),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.success) {
        if (result.data) {
          await reloadWishlist();
          await removeItem(product.product_id);
        } else {
          throw new Error("Invalid data received.");
        }
        toast.success("Product added to wishlist!");
      } else {
        throw new Error(result.message || "Failed to add product.");
      }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : String(error))
      );
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeFromWish = async (product_id: string) => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<wishItem>>(
        `/api/user/wishlist/deleteList`,
        {
          method: "DELETE",
          body: JSON.stringify({ product_id }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.success) {
        dispatch(
          setWish(wishItems.filter((item) => item.product_id !== product_id))
        );
        toast.success("Item removed from wishlist!");
      } else {
        throw new Error(result.message || "Failed to remove item.");
      }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : String(error))
      );
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    wishItems,
    addToWishList,
    removeFromWish,
    reloadWishlist,
    moveToWishList,
    loading,
    error,
  };
};
