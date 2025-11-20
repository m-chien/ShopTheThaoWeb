import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const calcTotals = (cartItems) => {
  let totalAmount = 0;
  let totalQuantity = 0;
  Object.values(cartItems).forEach((item) => {
    totalAmount += item.selectedPrice * item.cartQuantity;
    totalQuantity += item.cartQuantity;
  });
  return { totalAmount, totalQuantity };
};

const cartSlice = createSlice({
  name: "cart",
  initialState ,
  reducers: {
    addToCart(state, action) {
      const p = action.payload;
      const id = p.id;

      if (state.items[id]) {
        state.items[id].qty += 1;
      } else {
        state.items[id] = { product: p, qty: 1 };
      }

      const t = calcTotals(state.items);
      state.totalQuantity = t.quantity;
      state.totalPrice = t.price;
    },

    removeFromCart(state, action) {
      const id = action.payload;
      delete state.items[id];

      const t = calcTotals(state.items);
      state.totalQuantity = t.quantity;
      state.totalPrice = t.price;
    },

    incrementQty(state, action) {
      const id = action.payload;
      if (state.items[id]) state.items[id].qty++;
      const t = calcTotals(state.items);
      state.totalQuantity = t.quantity;
      state.totalPrice = t.price;
    },

    decrementQty(state, action) {
      const id = action.payload;
      if (!state.items[id]) return;

      state.items[id].qty--;
      if (state.items[id].qty <= 0) delete state.items[id];

      const t = calcTotals(state.items);
      state.totalQuantity = t.quantity;
      state.totalPrice = t.price;
    },

    clearCart(state) {
      state.items = {};
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectTotalQty = (state) => state.cart.totalQuantity;
export const selectTotalPrice = (state) => state.cart.totalPrice;
