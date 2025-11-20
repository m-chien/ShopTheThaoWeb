import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7299/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token (lưu trong HttpOnly cookie)
        const res = await axios.post("https://localhost:7299/api/User/refresh-token", {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        // Lưu access token mới
        sessionStorage.setItem("accessToken", newAccessToken);

        // Retry request ban đầu
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn, redirect login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);