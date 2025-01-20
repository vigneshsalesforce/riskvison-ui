// src/services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import {addToast} from '../redux/toastSlice';
import store from '../redux/store'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}


const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

api.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

         const tenant = localStorage.getItem("client");
            if (tenant) {
                //TO -DO ** `Use WildCard`
                // const baseURL = import.meta.env.VITE_WILDCARD_API_BASE_URL.replace(
                //     "*",
                //     tenant
                // );
                const baseURL = import.meta.env.VITE_API_BASE_URL;
                config.baseURL = baseURL;
            }

        logger.debug('API Request:', config);
        return config;
    },
    (error: AxiosError) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        logger.debug('API Response:', response);
        return response;
    },
    async (error: AxiosError) => {
        logger.error('API Response Error:', error);
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response && error.response.status === 401 && !originalRequest?._retry) {
            if(originalRequest) {
                originalRequest._retry = true;
            }
            localStorage.removeItem('token');
             store.dispatch(addToast({type:"error", message:"Session Expired, Please login again"}))
             window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;