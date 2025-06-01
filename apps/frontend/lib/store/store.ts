import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import addressReducer from "./Slices/addressSlice";
import cartReducer from "./Slices/cartSlice";
import wishReducer from "./Slices/wishSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
  auth: authReducer,
  address: addressReducer,
  cart: cartReducer,
  wish: wishReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "address", "cart", "wish"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REGISTER"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
