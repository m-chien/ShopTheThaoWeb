import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartslice.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
