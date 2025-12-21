import { api } from "./Api";

export const getAllOrders = () => {
  return api.get("/Order");
};

export const getOrderById = (id) => {
  return api.get(`/Order/${id}`);
};

export const updateOrder = (id, data) => {
  return api.put(`/Order/${id}`, data);
};

export const getOrderDetails = (orderId) => {
  return api.get(`/Order/${orderId}/details`);
};
