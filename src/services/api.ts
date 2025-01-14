// services/api.ts
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const tenant = localStorage.getItem("client");
    if (tenant) {
      const baseURL = import.meta.env.VITE_WILDCARD_API_BASE_URL.replace(
        "*",
        tenant
      );
      config.baseURL = baseURL;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { logout } = useAuthContext();
    if (error.response && error.response.status === 401) {
      console.log("401 Error response", error.response);
      localStorage.removeItem("token");
      localStorage.removeItem("client");
      localStorage.removeItem("isAuthenticated");
      logout(); // Use the logout function from the context
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;