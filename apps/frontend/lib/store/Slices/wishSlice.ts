import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface wishItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishState {
  items: wishItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishState = {
  items: [],
  loading: false,
  error: null,
};

const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    setWish: (state, action: PayloadAction<wishItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToWish: (state, action: PayloadAction<wishItem>) => {
      state.loading = true;
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );
      if (!existingItem) {
        state.items.push(action.payload);
      } else {
        toast("already in WishList");
      }
      state.loading = false;
    },
    removeFromWish: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload
      );
      state.loading = false;
    },
    clearWish: (state) => {
      state.loading = true;
      state.items = [];
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setWish, addToWish, removeFromWish, clearWish, setLoading, setError } = wishSlice.actions;
export default wishSlice.reducer;