import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {},
  shippingInfo: {},
  paymentInfo: {},
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setShippingInfo(state, action) {
      state.shippingInfo = action.payload;
    },
    setPaymentInfo(state, action) {
      state.paymentInfo = action.payload;
    },
    clearCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setUserInfo,
  setShippingInfo,
  setPaymentInfo,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
