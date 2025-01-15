let refreshTimeout;

export const scheduleTokenRefresh = (expiresIn) => {
  // e.g. server gave us 900 for a 15-minute token
  const refreshTime = (expiresIn - 60) * 1000; // refresh 1 min before expiry
  if (refreshTime <= 0) return;

  clearTokenRefresh(); // ensure no double-scheduling

  refreshTimeout = setTimeout(async () => {
    try {
      // Call /auth/refresh-token; sets new cookie
      const { data } = await axiosInstance.post("/auth/refresh-token");
      if (data.expiresIn) {
        scheduleTokenRefresh(data.expiresIn);
      }
    } catch (err) {
      console.error("Failed to refresh token:", err);
      window.location.href = "/";
    }
  }, refreshTime);
};

export const clearTokenRefresh = () => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
};
