import { api } from "./Api";

export const getAllProduct = () => {
  return api.get("/ProductVariant/grouped-products");
};

export const deleteProduct = (id) => {
  return api.delete(`/Product/${id}`);
};

export const updateProduct = (id, data) => {
  return api.put(`/Product/${id}`, data);
};
