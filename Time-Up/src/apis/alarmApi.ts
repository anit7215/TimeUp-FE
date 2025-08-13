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

// 알람 조회. 내 알람(myAlams), 기상알람(wakeup), 자동 알람 연결 post 말고 get으로 바꾸기
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

// 푸쉬 알람
// 임의 전달 값들
export interface PostWakeupAlarmPushRequest {
  repeat_count: number;
  repeat_interval: number;
  push_message: string;
}

export interface PostWakeupAlarmPushSuccess {
  wakeup_alarm_id: number;
  total_push_sent: number;
  scheduled_push_times: string[];
  message: string;
}

export interface ApiResponse<T> {
  result: 'Success' | 'Fail';
  status: number;
  success: T | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
}

// POST: 기상알람 푸시 알람 API
export const postWakeupAlarmPush = async (
  wakeupAlarmId: number,
  body: PostWakeupAlarmPushRequest
): Promise<ApiResponse<PostWakeupAlarmPushSuccess>> => {
  const token = await getAccessToken();

  const res = await axiosInstance.post<ApiResponse<PostWakeupAlarmPushSuccess>>(
    `/alarm/{wakeup_alarm_id}/push`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        wakeup_alarm_id: wakeupAlarmId,
      },
    }
  );

  return res.data;
};