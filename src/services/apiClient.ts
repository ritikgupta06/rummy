import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_TIMEOUT } from '@/src/constants';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://api.rummyroyale.com/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Token will be injected here from storage when backend is ready
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Handle unauthorized
      }
    }
    return Promise.reject(error);
  }
);

export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

export { baseURL };
