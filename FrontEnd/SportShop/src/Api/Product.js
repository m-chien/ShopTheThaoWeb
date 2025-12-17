import { api, apiDummy } from "./Api";

export const getAllProduct = () => {
  return api.get("/ProductVariant/grouped-products");
};

export const getAllProductDummy = () => {
  console.log(apiDummy.get("/products"));
  return apiDummy.get("/products");
};

export const filterProducts = (filterData) => {
  return api.post("/ProductVariant/filter-sp", filterData);
};
