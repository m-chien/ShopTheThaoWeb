import { api } from "./Api";

export const getAllSize = () => {
  return api.get("/Size");
};
