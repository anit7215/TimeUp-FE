// src/types/alarm.ts
// 기존 공통 타입
export type VibrationType = 'Basic Ring' | 'Soft Buzz' | 'Sharp Pulse' | 'Heartbeat' | 'Heavy Hit';

// 화면 출력용 타입
export interface AlarmItem {
  id: string;
  title: string;
  time: {
    period: '오전' | '오후';
    hour: number;
    minute: number;
  };
  date: {
    fullDate: string;
    dayOfWeek: string;
  };
  sound: string;
  vibrate: string;
  repeat: string;
  memo: string;
  isActive: boolean;
}

// 등록 요청용 타입 (POST)
// 수정 요청용 타입 (PUT / PATCH)
export interface PatchMyAlarmRequest {
  my_alarm_name: string;
  my_alarm_time: string;
  is_active: boolean;
  is_repeating: boolean;
  is_sound: boolean;
  is_vibrating: boolean;
  vibration_type: VibrationType;
  sound_id: number;
  repeat_interval: number;
  repeat_count: number;
  memo: string;
}

// 수정 응답 타입
export interface PatchMyAlarmResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: {
    alarm_id: number;
    updated_fields: string[];
    message: string;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
}

// 알람 비/활성화 요청: PATCH /my-alarms/activate?alarm_id=1
// ✅ 요청 body는 없음
// 응답 타입
export interface ToggleMyAlarmActivationResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: {
    is_active: boolean;
    message: string;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
}

// 내 알람 삭제 응답 타입
export interface DeleteMyAlarmResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: {
    alarm_id: number;
    message: string;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
}
