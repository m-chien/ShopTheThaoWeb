import { api } from "./Api";

export const getAllCategory = () => {
  return api.get("/Category");
};

export const createCategory = (data) => {
  return api.post("/Category", data);
};

export const updateCategory = (id, data) => {
  return api.put(`/Category/${id}`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`/Category/${id}`);
};
