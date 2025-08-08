import { CreateScheduleRequest, Schedule } from '../types/schedule';
import axios from './axios';

const API_URL = 'https://timeup-server.o-r.kr/'; // 백엔드 주소 설정

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

// 월별 일정 목록 불러오기 (GET)
export const getSchedules = async (
  accessToken: string, 
  month: string, 
  year: string) => {
  const res = await axios.get(`${API_URL}/schedules/days`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
      params: {
      year,
      month
    }
  });
  
  return res.data;

};


// 일정 삭제 (DELETE)
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await axios.delete(`${API_URL}/schedules/${scheduleId}`);
};

// 일정 수정 (PUT 또는 PATCH)
export const updateSchedule = async (scheduleId: string, data: CreateScheduleRequest): Promise<Schedule> => {
  const res = await axios.put(`${API_URL}/schedules/${scheduleId}`, data);
  return res.data;
};

// 일별 일정 불러오기
export const fetchDaySchedule = async (date: string) => {
  const res = await axios.get(`${API_URL}/schedule?date=${date}`, {
    params: { date },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
