// client/src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
});

// Function to get CSRF token
export const getCsrfToken = async () => {
  const response = await axiosInstance.get('/csrf-token');
  axiosInstance.defaults.headers.post['X-CSRF-Token'] = response.data.csrfToken;
  axiosInstance.defaults.headers.put['X-CSRF-Token'] = response.data.csrfToken;
  axiosInstance.defaults.headers.delete['X-CSRF-Token'] = response.data.csrfToken;
};

export default axiosInstance;
