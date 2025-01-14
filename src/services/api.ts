import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenant = localStorage.getItem('client');
    if (tenant) {
      const baseURL = import.meta.env.VITE_WILDCARD_API_BASE_URL.replace('*', tenant);
      config.baseURL = baseURL;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;