import { DiaryItem } from '../types/diary';
import { axiosInstance } from './axiosInstance';

export const getDiaryList = async (): Promise<DiaryItem[]> => {
  const response = await axiosInstance.get('/diaries/list');
  return response.data.success.diary;
};

export const getDiaryDate = async (date: string): Promise<DiaryItem | null> => {
  const response = await axiosInstance.get(`/diaries/date/${date}`);
  return response.data.success?.diary || null;
};

export const getDiaryDetail = async (diary_id: number): Promise<DiaryItem> => {
  const response = await axiosInstance.get(`/diaries/${diary_id}`);
  return response.data.success.diary;
};

export const postDiary = async (data: { title: string; content: string; diary_date: string }) => {
  const response = await axiosInstance.post('/diaries', data);
  return response.data.success; 
};

export const updateDiary = async ( diary_id: number, data: { title?: string; content?: string; diary_date?: string } ) => {
  const response = await axiosInstance.put(`/diaries/${diary_id}`, data);
  return response.data.success;
};

export const deleteDiary = async (diary_id: number) => {
  const response = await axiosInstance.delete(`/diaries/${diary_id}`);
  return response.data.success;
};