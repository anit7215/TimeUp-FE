// api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-url.com', // 공통 baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 모든 요청에 Authorization 헤더 자동 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token'); // 또는 다른 저장소에서 가져올 수도 있음
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
