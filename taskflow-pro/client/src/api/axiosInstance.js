// client/src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // CRITICAL: Sends httpOnly cookie with every request
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'; // Redirect on token expiry
    }
    return Promise.reject(error);
  }
);

export default api;
