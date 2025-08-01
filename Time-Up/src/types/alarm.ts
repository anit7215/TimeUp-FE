// src/types/alarm.ts
// 기존 공통 타입
export type VibrationType = 'Basic Ring' | 'Soft Buzz' | 'Sharp Pulse' | 'Heartbeat' | 'Heavy Hit';

// 화면 출력용 타입
export interface AlarmItem {
  id: number;
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

// 내 알람 등록 요청용 타입 (POST)
// 내 알람 수정 요청용 타입 (PUT / PATCH)
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

// 내 알람 수정 응답 타입
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

// 내 알람 알람 비/활성화 요청: PATCH /my-alarms/activate?alarm_id=1
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

// 기상 알람 수정 요청 타입 (PUT)
export interface UpdateWakeupAlarmRequest {
  wakeup_time: string; // ISO date string (e.g. "2025-07-31T06:30:00Z")
  is_active: boolean;
  is_repeating: boolean;
  is_sound: boolean;
  is_vibrating: boolean;
  vibration_type: 'default' | 'short1' | 'short2' | 'long1' | 'long2';
  sound_id: number | null;
  repeat_interval: number | null;
  repeat_count: number | null;
  memo: string;
}

// 기상 알람 수정 응답 타입
export interface UpdateWakeupAlarmResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: {
    wakeup_alarm_id: number;
    updated_fields: string[];
    message: string;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
}

// 기상 알람 활성/비활성 토글 응답 타입
export interface ToggleWakeupAlarmActivationResponse {
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

// 자동 알람 활성/비활성 토글 응답 타입
export interface ToggleAutoAlarmActivationResponse {
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

// 개별 알람 타입
export interface WakeupAlarmSummary {
  wakeup_alarm_id?: number;
  day: number;
  wakeup_time: string;
  is_active: boolean;
}

export interface AutoAlarmSummary {
  auto_alarm_id?: number;
  schedule_id?: number;
  wakeup_time: string;
  is_active: boolean;
}

export interface MyAlarmSummary {
  alarm_id?: number;
  my_alarm_name: string;
  my_alarm_time: string;
  is_active: boolean;
}

// 전체 알람 조회 응답
export interface GetAllAlarmsResponse {
  result: 'Success' | 'Fail';
  status: number;
  success: {
    user_id?: number;
    wakeup_alarms: WakeupAlarmSummary[] | null;
    auto_alarms: AutoAlarmSummary[] | null;
    my_alarms: MyAlarmSummary[] | null;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
}
