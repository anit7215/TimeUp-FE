// src/api/schedule.ts
import { axiosInstance } from './axiosInstance'
import { CreateScheduleRequest, Schedule } from '../types/schedule'

// 상세 스케줄 CRUD

// 일정 등록 (POST)
export const createSchedule = async (
  data: CreateScheduleRequest
  
): Promise<Schedule> => {
  
  console.log(data)
  const res = await axiosInstance.post('/schedules', data)
  return res.data
}

// 상세 일정 조회 (GET)
export const getScheduleById = async (scheduleId: string): Promise<Schedule> => {
  const response = await axiosInstance.get(`/schedules/${scheduleId}`);
  console.log(scheduleId, response.data)
  return response.data;
};

// 일정 삭제 (DELETE)
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await axiosInstance.delete(`/schedules/${scheduleId}`)
}

// 상세 일정 수정 (PUT)
export const updateSchedule = async (
  scheduleId: string,
  data: CreateScheduleRequest
): Promise<Schedule> => {
  const res = await axiosInstance.put(`/schedules/${scheduleId}`, data)
  return res.data
}


// 월별 일정 목록 조회 (GET)
export const getSchedules = async (targetDate: string) => {
  const res = await axiosInstance.get('/schedules/monthly', {
    params: { month: targetDate },
  })
  return res.data
}


// 일별 일정 목록 조회
export const getDailySchedules = async (dateISO: string) => {
  const dateParam = dateISO.slice(0, 10);
  const res = await axiosInstance.get('/schedules/day', {
    params: { date: dateParam },
  })
  return res.data
}
