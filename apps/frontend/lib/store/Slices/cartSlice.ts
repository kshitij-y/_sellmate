import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.loading = false;
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ product_id: string; quantity: number }>
    ) => {
      state.loading = true;
      const item = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.loading = false;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload
      );
      state.loading = false;
    },
    clearCart: (state) => {
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

export const {
  setCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;
export default cartSlice.reducer;
