// src/types/pushToken.ts
export interface SavePushTokenRequest {
  token: string;
}

export interface SavePushTokenSuccessResponse {
  result: 'Success';
  status: 200;
  success: number;
  error: null;
}

export interface SavePushTokenErrorResponse {
  result: 'Error';
  status: number;
  error: string;
  success?: number;
}

export type SavePushTokenResponse =
  | SavePushTokenSuccessResponse
  | SavePushTokenErrorResponse;

// 임의 전달 값들
// export interface PostWakeupAlarmPushRequest {
//   repeat_count: number;
//   repeat_interval: number;
//   push_message: string;
// }

// export interface PostWakeupAlarmPushSuccess {
//   wakeup_alarm_id: number;
//   total_push_sent: number;
//   scheduled_push_times: string[];
//   message: string;
// }

// export interface ApiResponse<T> {
//   result: 'Success' | 'Fail';
//   status: number;
//   success: T | null;
//   error: {
//     errorCode: string;
//     message: string;
//   } | null;
// }