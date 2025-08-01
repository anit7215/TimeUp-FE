// src/utils/alarmTransform.ts
import { AlarmItem, MyAlarmSummary, PatchMyAlarmRequest } from '@/src/types/alarm';

/**
 * 서버 응답(MyAlarmSummary) → 화면용 알람(AlarmItem)으로 변환
 */
export const transformAlarmResponseToItem = (alarm: MyAlarmSummary): AlarmItem => {
  const [hourStr, minuteStr] = alarm.my_alarm_time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  return {
    id: alarm.alarm_id ?? Date.now(),
    title: alarm.my_alarm_name,
    time: {
      period: hour < 12 ? '오전' : '오후',
      hour: hour > 12 ? hour - 12 : hour,
      minute,
    },
    date: {
      fullDate: '2025-01-01', // 서버에서 날짜 정보 없으므로 기본값
      dayOfWeek: '월', // 같은 이유로 기본값
    },
    sound: '선택',
    vibrate: '선택',
    repeat: '선택',
    memo: '',
    isActive: alarm.is_active,
  };
};

/**
 * 화면용 알람(AlarmItem) → 등록 요청(PatchMyAlarmRequest)
 */
export const transformAlarmToPostRequest = (alarm: AlarmItem): PatchMyAlarmRequest => {
  return {
    my_alarm_name: alarm.title,
    my_alarm_time: convertTimeTo24Hour(alarm.time),
    is_active: alarm.isActive,
    is_repeating: alarm.repeat !== '선택',
    is_sound: alarm.sound !== '선택',
    is_vibrating: alarm.vibrate !== '선택',
    vibration_type: mapVibrationType(alarm.vibrate),
    sound_id: 1, // TODO: sound 매핑 필요
    repeat_interval: extractInterval(alarm.repeat),
    repeat_count: extractCount(alarm.repeat),
    memo: alarm.memo,
  };
};

/**
 * 화면용 알람(AlarmItem) → 수정 요청(PatchMyAlarmRequest)
 */
export const transformAlarmToPatchRequest = transformAlarmToPostRequest;

// 유틸 함수들
const convertTimeTo24Hour = (time: AlarmItem['time']): string => {
  let hour = time.hour;
  if (time.period === '오후' && hour < 12) hour += 12;
  if (time.period === '오전' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
};

const extractInterval = (repeat: string): number => {
  const match = repeat.match(/(\d+)분/);
  return match ? parseInt(match[1], 10) : 0;
};

const extractCount = (repeat: string): number => {
  const match = repeat.match(/(\d+)회/);
  return match ? parseInt(match[1], 10) : 0;
};

const mapVibrationType = (vibrate: string): PatchMyAlarmRequest['vibration_type'] => {
  switch (vibrate) {
    case 'Basic Ring':
      return 'Basic Ring';
    case 'Soft Buzz':
      return 'Soft Buzz';
    case 'Sharp Pulse':
      return 'Sharp Pulse';
    case 'Heartbeat':
      return 'Heartbeat';
    case 'Heavy Hit':
      return 'Heavy Hit';
    default:
      return 'Basic Ring';
  }
};
