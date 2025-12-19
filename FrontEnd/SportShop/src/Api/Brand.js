import { api } from "./Api";

export const getAllBrand = () => {
  return api.get("/Brand");
};

export const createBrand = (data) => {
  return api.post("/Brand", data);
};
export const deleteBrand = (id) => {
  return api.delete(`/Brand/${id}`);
};
