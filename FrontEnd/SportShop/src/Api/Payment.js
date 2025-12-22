import { api } from "./Api";

export const createVnpayPayment = (data) => {
  return api.post("/checkout/vnpay", data);
};
