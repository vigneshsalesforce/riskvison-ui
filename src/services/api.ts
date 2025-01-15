// src/services/api.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useAuthContext } from "../context/AuthContext";
import logger from "../utils/logger";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


const getBaseUrl = (): string => {
    const tenant = localStorage.getItem("client");
    if (tenant) {
      return import.meta.env.VITE_WILDCARD_API_BASE_URL.replace("*", tenant);
    }
    return import.meta.env.VITE_API_BASE_URL;
};


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

      config.baseURL = getBaseUrl();

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const { logout } = useAuthContext() || { logout: () => {} };
        if (error.response && error.response.status === 401) {
            logger.error("401 Error response", error.response);
            localStorage.removeItem("token");
            localStorage.removeItem("client");
            localStorage.removeItem("isAuthenticated");
            logout();
            return Promise.reject(error);
        }
        logger.error("API Error", error);
        return Promise.reject(error);
    }
);


const request = async <T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await api.request<T>({
            method,
            url,
            data,
            ...config
        });
        return response.data;
    } catch (error: any) {
        logger.error(`API request failed for ${method} ${url}`, error);
         throw error;
    }
};

const apiService = {
   get: <T>(url: string, config?: AxiosRequestConfig) => request<T>('get', url, undefined, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('post', url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('put', url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>('delete', url, undefined, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('patch', url, data, config),
};

export default apiService;