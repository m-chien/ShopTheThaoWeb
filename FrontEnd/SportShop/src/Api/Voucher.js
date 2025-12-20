import { api } from "./Api"; // Instance axios

// 1. Lấy danh sách Voucher
export const getAllVouchers = () => {
  return api.get("/Vouchers");
};

// 2. Thêm mới
export const createVoucher = (data) => {
  return api.post("/Vouchers", data);
};

// 3. Cập nhật (Sửa)
export const updateVoucher = (id, data) => {
  return api.put(`/Vouchers/${id}`, data);
};

// 4. Xóa
export const deleteVoucher = (id) => {
  return api.delete(`/Vouchers/${id}`);
};
