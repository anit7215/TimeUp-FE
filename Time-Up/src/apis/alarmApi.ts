// src/apis/alarmApi.ts
import type { PatchMyAlarmRequest, PatchMyAlarmResponse } from '@/src/types/alarm';
import axios from 'axios';

const API_BASE = 'https://localhost:8081'; // 실제 서버 주소로 교체

// 알람 등록 (POST)
export const postMyAlarm = async (data: PatchMyAlarmRequest) => {
  const res = await axios.post<PatchMyAlarmResponse>(`${API_BASE}/my-alarms`, data, {
    headers: {
      Authorization: 'Bearer your-token', // Author 필요하면 추가
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// 알람 수정 (PATCH)
export const patchMyAlarm = async (alarmId: number, data: PatchMyAlarmRequest) => {
  const res = await axios.patch<PatchMyAlarmResponse>(`${API_BASE}/my-alarms/${alarmId}`, data);
  return res.data;
};