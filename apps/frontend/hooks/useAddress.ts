import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetcher } from "@/lib/TanStack-Query/api";
import ApiResponse from "@/lib/types/apiResponse";
import Address from "@/lib/types/address";
import { setAddress, setError } from "@/lib/store/Slices/addressSlice";

import { toast } from "sonner";
import { RootState } from "@/lib/store/store";

const useAddress = () => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.address.address);
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && !address) {
      hasFetched.current = true;
      fetchAddress();
    }
  }, [address]);

  const fetchAddress = useCallback(async () => {
    setLoading(true);
    setLocalError(null);
    try {
      const result = await fetcher<ApiResponse<Address>>(
        "/api/user/address/getAddress",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (result?.success && result.data) {
        dispatch(setAddress(result.data));
      } else {
        throw new Error(result?.error || "Failed to fetch address");
      }
    } catch (error: any) {
      setLocalError(error.message || "An unknown error occurred");
      dispatch(setError(error.message || "An unknown error occurred"));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const addAddress = useCallback(
    async (newAddress: Omit<Address, "id" | "user_id">) => {
      setLoading(true);
      setLocalError(null);
      try {
        const result = await fetcher<ApiResponse<Address>>(
          "/api/user/address/addAddress",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAddress),
            credentials: "include",
          }
        );

        if (result?.success && result.data) {
          dispatch(setAddress(result.data));
          toast.success("adrress added successfully");
        } else {
          throw new Error(result?.error || "Failed to add address");
        }
      } catch (error: any) {
        setLocalError(error.message || "An unknown error occurred");
        dispatch(setError(error.message || "An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const updateAddress = useCallback(
    async (updatedAddress: Omit<Address, "id" | "user_id">) => {
      setLoading(true);
      setLocalError(null);
      try {
        const result = await fetcher<ApiResponse<Address>>(
          "/api/user/address/updateAddress",
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedAddress),
            credentials: "include",
          }
        );

        if (result?.success && result.data) {
          dispatch(setAddress(result.data));
          toast.success("adrress changed successfully");
        } else {
          throw new Error(result?.error || "Failed to update address");
        }
      } catch (error: any) {
        setLocalError(error.message || "An unknown error occurred");
        dispatch(setError(error.message || "An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  return { address, loading, error, fetchAddress, addAddress, updateAddress };
};

export default useAddress;
