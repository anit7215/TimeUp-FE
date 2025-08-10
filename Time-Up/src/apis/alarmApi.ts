// src/apis/alarmApi.ts
import {
  DeleteMyAlarmResponse,
  GetAllAlarmsResponse,
  MyAlarmSummary,
  PostMyAlarmRequest,
  PostMyAlarmResponse,
  PutMyAlarmRequest,
  PutMyAlarmResponse,
  ToggleMyAlarmActivationResponse,
  UpdateWakeupAlarmRequest,
  UpdateWakeupAlarmResponse,
  WakeupAlarmSummary,
} from '@/src/types/alarm';
import { getAccessToken } from '@/src/utils/storage';
import { axiosInstance } from './axiosInstance';

// 내 알람 등록
export const postMyAlarm = async (data: PostMyAlarmRequest): Promise<PostMyAlarmResponse> => {
  const token = await getAccessToken();
  const response = await axiosInstance.post('/alarm/my', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 내 알람 수정
export const putMyAlarm = async (
  id: number,
  data: PutMyAlarmRequest
): Promise<PutMyAlarmResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.put<PutMyAlarmResponse>(
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

// 내 알람 활성/비활성화
export const toggleMyAlarmActivation = async (
  alarmId: number,
): Promise<ToggleMyAlarmActivationResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.patch<ToggleMyAlarmActivationResponse>(
    `/alarm/${alarmId}/my-active`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// 내 알람 삭제 응답
export const deleteMyAlarm = async (
  alarmId: number
): Promise<DeleteMyAlarmResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.delete<DeleteMyAlarmResponse>(
    `/alarm/${alarmId}/my-delete`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        alarm_id: alarmId,
      },
    }
  );
  return res.data;
};

// 기상 알람 수정 요청
export const putWakeupAlarm = async (
  wakeupAlarmId: number,
  data: UpdateWakeupAlarmRequest
): Promise<UpdateWakeupAlarmResponse> => {
  const token = await getAccessToken();
  const res = await axiosInstance.put<UpdateWakeupAlarmResponse>(
    `/alarm/${wakeupAlarmId}/wakeup`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        alarm_id: wakeupAlarmId,
      },
    }
  );
  return res.data;
};

// 알람 조회. 나중에 내 알람(myAlams), 기상알람(), 자동 알람 연결?
export const getMyAlarms = async (): Promise<{
  myAlarms: MyAlarmSummary[];
  wakeupAlarms: WakeupAlarmSummary[];
}> => {
  const res = await axiosInstance.get<GetAllAlarmsResponse>('/alarm/alarmlist');

  if (res.data.result === 'Success' && res.data.success !== null) {
    const success = res.data.success;
    return {
      myAlarms: success.my_alarms ?? [],
      wakeupAlarms: success.wakeup_alarms ?? [],
    };
  }

  throw new Error(res.data.error?.message ?? '알람 목록을 불러오지 못했습니다.');
};