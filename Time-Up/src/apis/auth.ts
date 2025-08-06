import { removeAccessToken, removeRefreshToken } from '../utils/storage';
import { axiosInstance } from './axiosInstance';

export const login = async (accessToken: string) => {
  const response = await axiosInstance.post('/auth/login/google', {
    access_token: accessToken,
  });
  return response.data;
};

export const onboarding = async (data: any) => {
  return axiosInstance.post('/auth/onboarding', data);
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  removeAccessToken();
  removeRefreshToken();
  return response;
};

export const signout = async () => {
  const response = await axiosInstance.delete('/auth/signout');
  removeAccessToken();
  removeRefreshToken();
  return response;
};