// src/api/schedule.ts
import { axiosInstance } from './axiosInstance'
import { CreateScheduleRequest, Schedule } from '../types/schedule'

// 일정 등록 (POST)
export const createSchedule = async (
  data: CreateScheduleRequest
  
): Promise<Schedule> => {
  
  console.log(data)
  const res = await axiosInstance.post('/schedules', data)
  return res.data
}

// 상세 스케줄 crud
export const getScheduleById = async (scheduleId: string) => {
  // GET /schedules/{scheduleId}
  await axiosInstance.get(`/schedules/${scheduleId}`)
};

// 일정 삭제 (DELETE)
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  await axiosInstance.delete(`/schedules/${scheduleId}`)
}

// 일정 수정 (PUT)
export const updateSchedule = async (
  scheduleId: string,
  data: CreateScheduleRequest
): Promise<Schedule> => {
  const res = await axiosInstance.put(`/schedules/${scheduleId}`, data)
  return res.data
}

// 월별 일정 목록 불러오기 (GET)
export const getSchedules = async (month: string, year: string) => {
  const res = await axiosInstance.get('/schedules/days', {
    params: { year, month },
  })
  return res.data
}


// 일별 일정 불러오기
export const fetchDaySchedule = async (date: string) => {
  const res = await axiosInstance.get('/schedule', {
    params: { date },
  })
  return res.data
}
