import type { AutoAlarmCheckTime, AutoAlarmFeedback, UserInfo } from '../types/user';
import { axiosInstance } from './axiosInstance';

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await axiosInstance.get<UserInfo>('/users/me');
  return response.data;
};

export const putUserInfo = async (payload: Partial<UserInfo>): Promise<void> => {
  await axiosInstance.patch('/users/me', payload);
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

export const updateAutoAlarm = async (auto_alarm_id: number, data: any) => {
  const response = await axiosInstance.put(`/alarm/${auto_alarm_id}/auto`, data);
  return response.data;
};

export const getAlarmList = async () => {
  const response = await axiosInstance.get('/alarm/alarmlist');
  return response.data;
}

export const getAutoAlarm = async(auto_alarm_id:number)=>{
  const response = await axiosInstance.get(`/alarm/${auto_alarm_id}/auto-mypage`);
  return response.data;
}