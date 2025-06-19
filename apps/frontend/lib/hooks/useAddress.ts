"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetcher } from "@/lib/TanStack-Query/api";
import ApiResponse from "@/lib/types/apiResponse";
import Address from "@/lib/types/address";
import {
  setAddresses,
  addAddress as addAddressAction,
  updateAddress as updateAddressAction,
  removeAddress as removeAddressAction,
  setError,
} from "@/lib/store/Slices/addressSlice";
import { RootState } from "../store/store";
import { toast } from "sonner";

const useAddress = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state: RootState) => state.address.addresses);

  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setLocalError(null);
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
          setLocalError("No addresses found");
          dispatch(setError("No addresses found"));
        }
      } else {
        throw new Error(result?.error || "Failed to fetch addresses");
      }
    } catch (error: any) {
      const msg = error.message || "An unknown error occurred";
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAddresses();
    }
  }, [fetchAddresses]);
  

  const addAddress = useCallback(
    async (
      newAddress: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">
    ) => {
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
          dispatch(addAddressAction(result.data));
          toast.success("Address added successfully");
        } else {
          throw new Error(result?.error || "Failed to add address");
        }
      } catch (error: any) {
        const msg = error.message || "An unknown error occurred";
        setLocalError(msg);
        dispatch(setError(msg));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const updateAddress = useCallback(
    async (updatedAddress: Address) => {
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
          dispatch(updateAddressAction(result.data));
          toast.success("Address updated successfully");
        } else {
          throw new Error(result?.error || "Failed to update address");
        }
      } catch (error: any) {
        const msg = error.message || "An unknown error occurred";
        setLocalError(msg);
        dispatch(setError(msg));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const removeAddress = useCallback(
    async (addressId: string) => {
      setLoading(true);
      setLocalError(null);
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
        const msg = error.message || "An unknown error occurred";
        setLocalError(msg);
        dispatch(setError(msg));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const getDefaultAddress = useCallback(() => {
    const defaultAddress = addresses?.find((addr) => addr.is_default);
    return defaultAddress || null;
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
