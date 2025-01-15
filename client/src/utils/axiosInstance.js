// src/utils/axiosInstance.js

import axios from "axios";
//import jwtDecode from 'jwt-decode';

// Set the address of the backend API
var address = "https://crypto-trading-bot-sa5d.onrender.com/api/";
if (process.env.NODE_ENV === "development") {
  address = "http://localhost:5000/api/";
}

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: address, // Update as needed
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to indicate if the token is being refreshed
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// src/utils/axiosInstance.js

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        axiosInstance
          .post("/auth/refresh-token") // No need to send refreshToken in the body
          .then(({ data }) => {
            const { accessToken } = data;

            // Optionally, if accessToken is stored elsewhere
            // Update Authorization header
            axiosInstance.defaults.headers.common["Authorization"] =
              "Bearer " + accessToken;
            originalRequest.headers["Authorization"] = "Bearer " + accessToken;

            processQueue(null, accessToken);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Redirect to login on failure
            window.location.href = "/";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
