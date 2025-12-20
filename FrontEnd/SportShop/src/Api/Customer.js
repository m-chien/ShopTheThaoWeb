import { api } from "./Api"; // axios instance

// 1. Lấy danh sách tất cả khách hàng (Có tìm kiếm)
export const getAllCustomers = (keyword = "") => {
  return api.get(`/User/all?keyword=${keyword}`);
};

// 2. Khóa / Mở khóa tài khoản khách hàng
export const toggleCustomerStatus = (id) => {
  return api.patch(`/User/${id}/toggle-status`);
};
