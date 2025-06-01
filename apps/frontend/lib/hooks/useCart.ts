import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEffect, useCallback } from "react";
import { fetcher } from "../TanStack-Query/api";
import ApiResponse from "../types/apiResponse";
import { setCart, setLoading, setError } from "../store/Slices/cartSlice";
import { toast } from "sonner";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const fetchCart = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const result = await fetcher<ApiResponse<CartItem[]>>(
        `/api/user/cart/getCart`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (result.success) {
        if (result.data) {
          dispatch(setCart(result.data));
        } else {
          dispatch(setCart([]));
        }
      } else {
        throw new Error(result.message || "Failed to fetch cart.");
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
    fetchCart();
  }, []);

  const reloadCart = async () => {
    await fetchCart();
  };

  const addItems = async (product: {
    product_id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }) => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<CartItem>>(
        `/api/user/cart/addToCart`,
        {
          method: "POST",
          body: JSON.stringify(product),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.success) {
        toast.success("Product added to cart!");
        reloadCart();
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

  const removeItem = async (product_id: string) => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<CartItem>>(
        `/api/user/cart/removeFromCart`,
        {
          method: "DELETE",
          body: JSON.stringify({ product_id }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.success) {
        toast.success("Item removed from cart!");
        reloadCart();
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

  const updateQuantity = async (product_id: string, quantity: number) => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<CartItem>>(
        `/api/user/cart/updateCartQuantity`,
        {
          method: "PATCH",
          body: JSON.stringify({ product_id, quantity }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (result.success) {
        toast.success("Cart quantity updated!");
        reloadCart();
      } else {
        throw new Error(result.message || "Failed to update quantity.");
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
    cartItems,
    addItems,
    removeItem,
    updateQuantity,
    reloadCart,
    loading,
    error,
  };
};
