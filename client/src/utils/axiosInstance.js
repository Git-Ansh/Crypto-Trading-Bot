import axios from "axios";
import { scheduleTokenRefresh } from "./tokenService";
let address = "https://api.crypto-pilot.dev/api/";
if (process.env.NODE_ENV === "development") {
  address = "http://localhost:5000/api/";
}

const axiosInstance = axios.create({
  baseURL: address,
  withCredentials: true, // important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// If you want 401-based refresh logic:
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;
      // Attempt refresh
      try {
        const { data } = await axiosInstance.post("/auth/refresh-token");
        if (data.expiresIn) {
          scheduleTokenRefresh(data.expiresIn);
        }
        return axiosInstance(error.config);
      } catch (refreshErr) {
        window.location.href = "/";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
