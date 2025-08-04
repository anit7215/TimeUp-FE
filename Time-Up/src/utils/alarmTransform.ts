// src/utils/alarmTransform.ts
import { AlarmItem, PostMyAlarmRequest, PutMyAlarmRequest } from '@/src/types/alarm';
import moment from 'moment-timezone';

export type AlarmWithoutId = Omit<AlarmItem, 'id'>;

//AlarmItem → PostMyAlarmRequest 변환
export const toPostMyAlarmRequest = (alarm: AlarmWithoutId): PostMyAlarmRequest => {
  const { date, time, title, memo, isActive, sound, vibrate, repeat, isRepeating, isSound, isVibrating } = alarm;
  // 1. 날짜/시간 정보 추출
  const [year, month, day] = date.fullDate.split('-').map(Number);
  const hour = time.period === '오전' ? time.hour : time.hour + 12;

  const alarmTime = moment.tz(
    {
      year,
      month: month - 1,
      day,
      hour,
      minute: time.minute,
    },
    'Asia/Seoul'
  ).format('YYYY-MM-DDTHH:mm:ss');

  // 2. 반복 정보 파싱 (예: "10분, 5회" → 10, 5)
  let repeat_interval = 0;
  let repeat_count = 0;

  if (repeat && repeat.includes(',')) {
    const [intervalStr, countStr] = repeat.split(',').map(s => s.trim());

    const intervalMatch = intervalStr.match(/(\d+)분/);
    if (intervalMatch) {
      repeat_interval = parseInt(intervalMatch[1], 10);
    }

    const countMatch = countStr.match(/(\d+)회/);
    if (countMatch) {
      repeat_count = parseInt(countMatch[1], 10);
    }
  }

  return {
    my_alarm_name: title,
    my_alarm_time: alarmTime,
    is_active: isActive,
    is_repeating: isRepeating,
    is_sound: isSound,
    is_vibrating: isVibrating,
    vibration_type: convertToVibrationType(vibrate),
    sound_id: convertToSoundId(sound),
    repeat_interval,
    repeat_count,
    memo,
  };
};

// AlarmItem → PutMyAlarmRequest 변환 (PUT용)
export const toPutMyAlarmRequest = (alarm: AlarmItem): PutMyAlarmRequest => {
  const { date, time, title, memo, isActive, sound, vibrate, repeat, isRepeating, isSound, isVibrating } = alarm;

  const [year, month, day] = date.fullDate.split('-').map(Number);
  const hour = time.period === '오전' ? time.hour : time.hour + 12;

  const alarmTime = moment.tz(
    {
      year,
      month: month - 1,
      day,
      hour,
      minute: time.minute,
    },
    'Asia/Seoul'
  ).format('YYYY-MM-DDTHH:mm:ss');

  // repeat 유효성 체크
  let repeat_interval = 0;
  let repeat_count = 0;

  if (repeat && repeat.includes(',')) {
    const [intervalStr, countStr] = repeat.split(',').map(s => s.trim());

    const intervalMatch = intervalStr.match(/(\d+)분/);
    if (intervalMatch) {
      repeat_interval = parseInt(intervalMatch[1], 10);
    }

    const countMatch = countStr.match(/(\d+)회/);
    if (countMatch) {
      repeat_count = parseInt(countMatch[1], 10);
    }
  }

  return {
    my_alarm_name: title,
    my_alarm_time: alarmTime,
    is_active: isActive,
    is_repeating: isRepeating,
    is_sound: isSound,
    is_vibrating: isVibrating,
    vibration_type: convertToVibrationType(vibrate),
    sound_id: convertToSoundId(sound),
    repeat_interval,
    repeat_count,
    memo,

  };
};


// 유틸 함수들
const convertToVibrationType = (v: string): PostMyAlarmRequest['vibration_type'] => {
  switch (v) {
    case 'Basic Ring': return 'short1';
    case 'Soft Buzz': return 'short2';
    case 'Sharp Pulse': return 'long1';
    case 'Heartbeat': return 'long2';
    default: return 'default';
  }
};

const convertToSoundId = (s: string): number => {
  const soundMap: Record<string, number> = {
    'Basic Ring': 1,
    'Heavy Raindrop': 2,
    'Ocean Wave': 3,
    'Bird Chirp': 4,
    'Classic Bell': 5,
  };
  return soundMap[s] ?? 1;
};