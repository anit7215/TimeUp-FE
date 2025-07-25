import { CreateScheduleRequest, Schedule } from '../types/schedule';
import axios from './axios';

const API_URL = 'https://your-api-url.com'; // 백엔드 주소 설정

// 일정 등록 (POST) authorization 헤더 자동으로 지정하는 axios 설정하기
export const createSchedule = async (
  data: CreateScheduleRequest,
  token: string
): Promise<Schedule> => {
  const res = await axios.post(`${API_URL}/schedules`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// 일정 목록 불러오기 (GET)
export const getSchedules = async (): Promise<Schedule[]> => {
  const res = await axios.get(`${API_URL}/schedules`);
  return res.data;
};

// 일정 삭제 (DELETE)
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await axios.delete(`${API_URL}/schedules/${scheduleId}`);
};

// 일정 수정 (PUT 또는 PATCH)
export const updateSchedule = async (id: string, data: Partial<CreateScheduleRequest>): Promise<Schedule> => {
  const res = await axios.put(`${API_URL}/schedules/${id}`, data);
  return res.data;
};
