import User from "@/lib/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.token = null;
    },
  },
});

export const { setUser, setLoading, setError,setToken, signOut } = authSlice.actions;
export default authSlice.reducer;
