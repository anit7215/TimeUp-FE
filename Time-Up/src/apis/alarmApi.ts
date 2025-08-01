// src/apis/alarmApi.ts
import {
  DeleteMyAlarmResponse,
  GetAllAlarmsResponse,
  PatchMyAlarmRequest,
  PatchMyAlarmResponse,
  ToggleMyAlarmActivationResponse,
} from '@/src/types/alarm';
import axios from 'axios';

// base 설정
const API_BASE_URL = 'https://timeup-server.o-r.kr/api';

export const getMyAlarms = async (): Promise<GetAllAlarmsResponse['success']['my_alarms']> => {
  const res = await axios.get<GetAllAlarmsResponse>(`${API_BASE_URL}/alarms`);
  if (res.data.result === 'Success') {
    return res.data.success?.my_alarms ?? [];
  }
  throw new Error(res.data.error?.message ?? '알람 목록을 불러오지 못했습니다.');
};

export const postMyAlarm = async (data: PatchMyAlarmRequest): Promise<PatchMyAlarmResponse> => {
  const res = await axios.post<PatchMyAlarmResponse>(`${API_BASE_URL}/my-alarms`, data);
  return res.data;
};

export const patchMyAlarm = async (
  id: number,
  data: PatchMyAlarmRequest
): Promise<PatchMyAlarmResponse> => {
  const res = await axios.patch<PatchMyAlarmResponse>(`${API_BASE_URL}/my-alarms/${id}`, data);
  return res.data;
};

export const deleteMyAlarm = async (id: number): Promise<DeleteMyAlarmResponse> => {
  const res = await axios.delete<DeleteMyAlarmResponse>(`${API_BASE_URL}/my-alarms/${id}`);
  return res.data;
};

export const toggleMyAlarmActivation = async (
  id: number
): Promise<ToggleMyAlarmActivationResponse> => {
  const res = await axios.patch<ToggleMyAlarmActivationResponse>(
    `${API_BASE_URL}/my-alarms/activate?alarm_id=${id}`
  );
  return res.data;
};
