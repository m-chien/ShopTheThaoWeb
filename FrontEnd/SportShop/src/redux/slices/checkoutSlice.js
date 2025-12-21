import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    phone: "",
    address: "",
  },
  shippingInfo: {}, // giữ nếu cần sau này
  paymentInfo: {},
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      // action.payload should be { phone, address }
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

// selector đơn giản
export const selectUserInfo = (state) => state.checkout.userInfo;

export default checkoutSlice.reducer;
