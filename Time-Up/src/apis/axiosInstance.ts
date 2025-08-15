 import axios from 'axios';
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken } from '../utils/storage';

let refreshPromise: Promise<string | null> | null = null;

export const axiosInstance = axios.create({
  baseURL: process.env.SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token');

            const { data } = await axiosInstance.post('/auth/refresh', {
              refresh: refreshToken,
            });

            setAccessToken(data.data.accessToken);
            setRefreshToken(data.data.refreshToken);

            return data.data.accessToken;
          } catch (e) {
            removeAccessToken();
            removeRefreshToken();
            window.location.href = '/';
            return null;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      const newAccessToken = await refreshPromise;
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);