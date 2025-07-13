"use client";
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetcher } from "@/lib/TanStack-Query/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type Address  from "@/lib/types/address";
import type ApiResponse from "@/lib/types/apiResponse";
import { toast } from "sonner";

import {
  setAddresses,
  addAddress as addAddressAction,
  updateAddress as updateAddressAction,
  removeAddress as removeAddressAction,
  setError,
  setLoading,
} from "@/lib/store/Slices/addressSlice";
import type { RootState } from "../store/store";

const useAddress = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const loading = useSelector((state: RootState) => state.address.loading);
  const error = useSelector((state: RootState) => state.address.error);
  const hasFetched = useRef(false);

  const fetchAddresses = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const result = await fetcher<ApiResponse<Address[]>>(
        "/api/user/address",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (result?.success && Array.isArray(result.data)) {
        dispatch(setAddresses(result.data));
        if (result.data.length === 0) {
          dispatch(setError("No addresses found"));
        }
      } else {
        throw new Error(result?.error || "Failed to fetch addresses");
      }
    } catch (error: any) {
      dispatch(setError(error.message || "An unknown error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasFetched.current && typeof window !== "undefined") {
      hasFetched.current = true;
      fetchAddresses();
    }
  }, [fetchAddresses]);

  const addAddress = useCallback(
    async (
      newAddress: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">
    ) => {
      dispatch(setLoading(true));
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
          dispatch(addAddressAction(result.data));
          toast.success("Address added successfully");
        } else {
          throw new Error(result?.error || "Failed to add address");
        }
      } catch (error: any) {
        dispatch(setError(error.message || "An unknown error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateAddress = useCallback(
    async (updatedAddress: Address) => {
      dispatch(setLoading(true));
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
          dispatch(updateAddressAction(result.data));
          toast.success("Address updated successfully");
        } else {
          throw new Error(result?.error || "Failed to update address");
        }
      } catch (error: any) {
        dispatch(setError(error.message || "An unknown error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const removeAddress = useCallback(
    async (addressId: string) => {
      dispatch(setLoading(true));
      try {
        const result = await fetcher<ApiResponse<null>>(
          "/api/user/address/deleteAddress",
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address_id: addressId }),
            credentials: "include",
          }
        );

        if (result?.success) {
          dispatch(removeAddressAction(addressId));
          toast.success("Address removed successfully");
        } else {
          throw new Error(result?.error || "Failed to remove address");
        }
      } catch (error: any) {
        dispatch(setError(error.message || "An unknown error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const getDefaultAddress = useCallback(() => {
    return addresses.find((addr) => addr.is_default) || null;
  }, [addresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    getDefaultAddress,
  };
};

export default useAddress;
