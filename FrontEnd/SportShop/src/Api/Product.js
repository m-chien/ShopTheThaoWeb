import { api } from "./Api";

export const getAllProduct = () => {
  return api.get("/ProductVariant/grouped-products");
};
