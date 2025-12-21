import { api } from "./Api"; // axios instance

export const User = () => {
  const register = async (username, pass, email, fullname) => {
    try {
      const response = await api.post("/User/register", {
        userName: username,
        password: pass,
        email: email,
        fullName: fullname,
      });
      console.log("🚀 ~ register ~ response:", response)
      sessionStorage.setItem("accessToken", response.data.data.accessToken);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };
  // Đăng nhập
  const login = async (username, password) => {
    try {
      const response = await api.post("/User/login", {
        UserName: username,
        Password: password,
      });
      console.log("🚀 ~ login ~ response:", response)

      sessionStorage.setItem("accessToken", response.data.data.accessToken);
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
    register,
    login,
    getUserInfo, // nhớ return
  };
};
