import { api } from "./Api"; // axios instance

export const User = () => {
  // Đăng nhập
  const login = async (username, password) => {
    try {
      const response = await api.post("/User/login", {
        userName: username,
        password: password,
      });

      sessionStorage.setItem("accessToken", response.data.data.accessToken);
      document.cookie = `refreshToken=${response.data.data.refreshToken}; path=/; secure; samesite=strict`;
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Lấy thông tin người dùng
  const getUserInfo = async () => {
    try {
      const response = await api.get("/User/profile");
      return response.data;
    } catch (error) {
      console.error(
        "Get user info error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  return {
    login,
    getUserInfo, // nhớ return
  };
};
