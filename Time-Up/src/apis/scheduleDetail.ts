import { Alert } from 'react-native';
import { Schedule } from '../types/schedule';
import { axiosInstance } from './axiosInstance';


export const getScheduleDetail = async (scheduleId: string) : Promise<Schedule> => {
    try {
        const response = await axiosInstance.get<Schedule>(`/schedules/${scheduleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedule detail:', error);
        Alert.alert('일정 상세 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
        throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리할 수 있게 함
    }
}