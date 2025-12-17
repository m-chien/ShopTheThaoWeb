import { api } from "./Api";

export const getAllBrand = () => {
  return api.get("/Brand");
};
