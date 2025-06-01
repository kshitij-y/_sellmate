import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Address from "@/lib/types/address";

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (action.payload.is_default) {
        state.addresses = state.addresses.map((addr) => ({
          ...addr,
          is_default: false,
        }));
      }
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const updated = action.payload;

      if (updated.is_default) {
        state.addresses = state.addresses.map((addr) =>
          addr.id === updated.id ? updated : { ...addr, is_default: false }
        );
      } else {
        const index = state.addresses.findIndex((a) => a.id === updated.id);
        if (index !== -1) {
          state.addresses[index] = updated;
        }
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      const toRemove = state.addresses.find((a) => a.id === idToRemove);

      state.addresses = state.addresses.filter((a) => a.id !== idToRemove);

      if (toRemove?.is_default && state.addresses.length > 0) {
        state.addresses[0].is_default = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.error = null;
    },
  },
});

export const {
  setAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setLoading,
  setError,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;
