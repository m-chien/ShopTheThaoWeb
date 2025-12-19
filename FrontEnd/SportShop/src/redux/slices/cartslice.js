// redux/slices/cartslice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0, // tổng số lượng (sum quantity)
  cartTotalAmount: 0, // tổng tiền (sum price * qty)
};

const recalcTotals = (state) => {
  let quantity = 0;
  let amount = 0;

  state.cartItems.forEach((item) => {
    quantity += item.quantity;
    amount += (item.price || 0) * item.quantity;
  });

  state.cartTotalQuantity = quantity;
  state.cartTotalAmount = amount;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const exist = state.cartItems.find((i) => i.variantId === item.variantId);

      if (exist) {
        exist.quantity += item.quantity || 1;
      } else {
        // đảm bảo có trường isSelected (mặc định false nếu undefined)
        state.cartItems.push({
          ...item,
          quantity: item.quantity || 1,
          isSelected: item.isSelected ?? false,
        });
      }

      recalcTotals(state);
    },

    toggleSelect(state, action) {
      const variantId = action.payload;
      const item = state.cartItems.find((i) => i.variantId === variantId);
      if (item) item.isSelected = !item.isSelected;
      // totals không cần cập nhật (subtotal selected sẽ tính bằng selector)
    },

    incrementQty(state, action) {
      const variantId = action.payload;
      const item = state.cartItems.find((i) => i.variantId === variantId);
      if (item) item.quantity += 1;
      recalcTotals(state);
    },

    decrementQty(state, action) {
      const variantId = action.payload;
      const item = state.cartItems.find((i) => i.variantId === variantId);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.cartItems = state.cartItems.filter(
          (i) => i.variantId !== variantId,
        );
      }
      recalcTotals(state);
    },

    removeFromCart(state, action) {
      const variantId = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => i.variantId !== variantId,
      );
      recalcTotals(state);
    },

    clearCart(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
  },
});

export const {
  addToCart,
  toggleSelect,
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

/* ===== Selectors ===== */

// tất cả items
export const selectCartItems = (state) => state.cart.cartItems || [];

// số dòng sản phẩm (distinct items)
export const selectCartDistinctCount = (state) =>
  (state.cart.cartItems || []).length;

// tổng quantity (sum qty)
export const selectCartTotalQuantity = (state) =>
  state.cart.cartTotalQuantity || 0;

// tổng tiền toàn giỏ
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount || 0;

// items được chọn (isSelected === true)
export const selectSelectedItems = (state) =>
  (state.cart.cartItems || []).filter((i) => i.isSelected);

// tổng số lượng của items đã chọn
export const selectSelectedTotalQty = (state) =>
  (state.cart.cartItems || [])
    .filter((i) => i.isSelected)
    .reduce((s, i) => s + i.quantity, 0);

// tổng tiền của items đã chọn
export const selectSelectedTotalAmount = (state) =>
  (state.cart.cartItems || [])
    .filter((i) => i.isSelected)
    .reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
