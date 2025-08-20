// src/apis/alarmApi.ts
import {
  AutoAlarmSummary,
  DeleteMyAlarmResponse,
  GetAllAlarmsResponse,
  MyAlarmSummary,
  PostMyAlarmRequest,
  PostMyAlarmResponse,
  PutMyAlarmRequest,
  PutMyAlarmResponse,
  ToggleMyAlarmActivationResponse,
  UpdateWakeupAlarmRequest,
  WakeupAlarmSummary
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

// 기상알람 수정 요청
// src/apis/alarmApi.ts
export const putWakeupAlarm = async (wakeupAlarmId: number, body: UpdateWakeupAlarmRequest) => {
  const token = await getAccessToken();
  const res = await axiosInstance.put(
    `/alarm/${wakeupAlarmId}/wakeup`,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
};


// 기상알람 활성/비활성화 응답
export interface ToggleWakeupActiveResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: (
    // 간단 응답 형태
    { is_active: boolean; message?: string }
    // 혹은 상세 객체 형태(명세 예시)
    | {
        wakeup_alarm_id: number;
        user_id: number;
        day: number;
        wakeup_time: string;
        is_active: boolean;
        is_repeating: boolean;
        is_vibrating: boolean;
        is_sound: boolean;
        repeat_interval: number | null;
        repeat_count: number | null;
        sound_id: number | null;
        vibration_type: string;
        memo: string | null;
        created_at: string | null;
        updated_at: string | null;
      }
  ) | null;
  error: { errorCode: string; message: string } | null;
}

// 기상알람 활성/비활성화 요청
export const patchToggleWakeupAlarmActive = async (
  wakeupAlarmId: number
): Promise<ToggleWakeupActiveResponse> => {
  const token = await getAccessToken();

  const res = await axiosInstance.patch<ToggleWakeupActiveResponse>(
    `/alarm/${wakeupAlarmId}/wakeup-active`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      params: {
        wakeup_alarm_id: wakeupAlarmId,
      },
    }
  );

  return res.data;
};

// 자동알람 활성/비활성화
export interface ToggleAutoAlarmResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: null | {
    auto_alarm_id: number;
    schedule_id: number;
    wakeup_time: string; // ISO
    is_active: boolean;
    is_repeating: boolean;
    repeat_interval: number;
    repeat_count: number;
    created_at: string;
    is_sound: boolean;
    is_vibrating: boolean;
    sound_id: number;
    vibration_type: string;
  };
  error: null | {
    errorCode: string;
    message: string;
  };
}

export async function toggleAutoAlarmActivation(autoAlarmId: number) {
  const token = await getAccessToken();

  // Query 에 alarm_id 가 필요하다고 해서 동일 값으로 전달함.
  const res = await axiosInstance.patch<ToggleAutoAlarmResponse>(
    `/alarm/${autoAlarmId}/auto-active`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        alarm_id: autoAlarmId,
      },
    }
  );

  if (res.data.result !== 'Success' || !res.data.success) {
    const msg = res.data.error?.message ?? '자동 알람 토글 실패';
    throw new Error(msg);
  }

  return res.data.success; // { is_active, wakeup_time, ... }
}

// 알람 조회. 내 알람(myAlams), 기상알람(wakeup), 자동알람(autoAlarms)
export const getMyAlarms = async (): Promise<{
  myAlarms: MyAlarmSummary[];
  wakeupAlarms: WakeupAlarmSummary[];
  autoAlarms: AutoAlarmSummary[];
}> => {
  const res = await axiosInstance.get<GetAllAlarmsResponse>('/alarm/alarmlist');

  if (res.data.result === 'Success' && res.data.success !== null) {
    const success = res.data.success;
    return {
      myAlarms: success.my_alarms ?? [],
      wakeupAlarms: success.wakeup_alarms ?? [],
      autoAlarms: success.auto_alarms ?? [],
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