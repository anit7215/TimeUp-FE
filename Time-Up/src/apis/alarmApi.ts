// src/apis/alarmApi.ts
import {
  DeleteMyAlarmResponse,
  GetAllAlarmsResponse,
  MyAlarmSummary,
  PatchMyAlarmRequest,
  PatchMyAlarmResponse,
  PostMyAlarmRequest,
  PostMyAlarmResponse,
  ToggleMyAlarmActivationResponse,
} from '@/src/types/alarm';
import { getAccessToken } from '@/src/utils/storage';
import { axiosInstance } from './axiosInstance';

// base 설정
const API_BASE_URL = 'https://timeup-server.o-r.kr/api';

export const postMyAlarm = async (data: PostMyAlarmRequest): Promise<PostMyAlarmResponse> => {
  const token = await getAccessToken();
  const response = await axiosInstance.post('/alarm/my', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const patchMyAlarm = async (
  id: number,
  data: PatchMyAlarmRequest
): Promise<PatchMyAlarmResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.patch<PatchMyAlarmResponse>(
    `/alarm/${id}/my`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const toggleMyAlarmActivation = async (
  id: number
): Promise<ToggleMyAlarmActivationResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.patch<ToggleMyAlarmActivationResponse>(
    `/alarm/${id}/my-active`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteMyAlarm = async (id: number): Promise<DeleteMyAlarmResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.delete<DeleteMyAlarmResponse>(
    `/alarm/${id}/my-delete`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getMyAlarms = async (): Promise<MyAlarmSummary[]> => {
  const res = await axiosInstance.get<GetAllAlarmsResponse>('/alarm/alarmlist');
  if (res.data.result === 'Success' && res.data.success !== null) {
    const success = res.data.success;
    return success.my_alarms ?? [];
  }
  throw new Error(res.data.error?.message ?? '알람 목록을 불러오지 못했습니다.');
};

export const fetchMyAlarms = async (): Promise<GetAllAlarmsResponse> => {
  const token = await getAccessToken();
  const response = await axiosInstance.get('/alarm/alarmlist', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  return response.data;
};
