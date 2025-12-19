import { api } from "./Api";

export const getAllColor = () => {
  return api.get("/Color");
};
