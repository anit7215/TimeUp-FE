import { axiosInstance } from './axiosInstance';
import type { UserInfo, AutoAlarmCheckTime, AutoAlarmFeedback } from '../types/user';

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>('/users/me');
  return response.data;
};

export const putUserInfo = async (payload: Partial<UserInfo>): Promise<void> => {
  await axiosInstance.put('/users/me', payload);
};

export const getAutoAlarmCheckTime = async (): Promise<AutoAlarmCheckTime> => {
  const response = await axiosInstance.get<AutoAlarmCheckTime>('/users/me/auto-alarm-check-time');
  return response.data;
};

export const putAutoAlarmCheckTime = async (payload: AutoAlarmCheckTime): Promise<{ message: string }> => {
  const response = await axiosInstance.put<{ message: string }>('/users/me/auto-alarm-check-time', payload);
  return response.data;
};

export const postAutoAlarmFeedback = async (payload: AutoAlarmFeedback): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/users/me/auto-alarm-feedback', payload);
  return response.data;
};

