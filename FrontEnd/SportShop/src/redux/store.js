import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartslice.js";
import checkoutReducer from "./slices/checkoutSlice.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer
  },
});
