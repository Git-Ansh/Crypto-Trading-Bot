// src/utils/tokenService.js

import {jwtDecode} from 'jwt-decode';
import axiosInstance from './axiosInstance';

let refreshTokenTimeout;

export const scheduleTokenRefresh = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  const decoded = jwtDecode(accessToken);
  const expiresAt = decoded.exp * 1000; // Convert to milliseconds
  const timeout = expiresAt - Date.now() - 60 * 1000; // Refresh 1 minute before expiry

  if (timeout > 0) {
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
  }
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axiosInstance.post('/auth/refresh-token', {
      refreshToken: refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    // Update tokens in localStorage
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    // Reschedule the next refresh
    scheduleTokenRefresh();
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Redirect to login or handle accordingly
    window.location.href = '/';
  }
};

export const clearTokenRefresh = () => {
  if (refreshTokenTimeout) {
    clearTimeout(refreshTokenTimeout);
  }
};
