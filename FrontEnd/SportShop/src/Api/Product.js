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

export const createProduct = (data) => {
  return api.post("/Product", data);
};

export const getVariantsByProductId = (productId) => {
  return api.get(`/ProductVariant/product/${productId}`);
};

// Cập nhật 1 biến thể (Giá/Kho)
export const updateProductVariant = (id, data) => {
  return api.put(`/ProductVariant/${id}`, data);
};

// Xóa 1 biến thể
export const deleteProductVariant = (id) => {
  return api.delete(`/ProductVariant/${id}`);
};

export const createProductVariant = (data) => {
  return api.post("/ProductVariant", data);
};
