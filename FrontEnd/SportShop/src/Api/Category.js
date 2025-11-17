import { api } from "./Api";

export const getAllCategory = () => {   
  return api.get("/Category");
};
