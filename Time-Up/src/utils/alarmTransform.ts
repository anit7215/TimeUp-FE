// src/utils/alarmTransform.ts
import { AlarmItem, PostMyAlarmRequest, PutMyAlarmRequest, UpdateWakeupAlarmRequest, WakeupAlarmSummary } from '@/src/types/alarm';
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

// 기상 알람 수정 변환 (Put)
export const toPutWakeupAlarmRequest = (alarm: AlarmItem): UpdateWakeupAlarmRequest => {
  const { date, time, title, memo, isActive, sound, vibrate, repeat, isRepeating, isSound, isVibrating } = alarm;
  const wakeup_time = convertAlarmTimeToISOString(date.fullDate, time.period, time.hour, time.minute);

  let repeat_interval = 0;
  let repeat_count = 0;

  if (repeat && repeat.includes(',')) {
    const [intervalStr, countStr] = repeat.split(',').map(s => s.trim());
    const intervalMatch = intervalStr.match(/(\d+)분/);
    if (intervalMatch) repeat_interval = parseInt(intervalMatch[1], 10);
    const countMatch = countStr.match(/(\d+)회/);
    if (countMatch) repeat_count = parseInt(countMatch[1], 10);
  }

  return {
    wakeup_time, // "2025-07-31T06:30:00Z"
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

const convertAlarmTimeToISOString = (date: string, period: string, hour: number, minute: number): string => {
  let h = hour;
  if (period === '오후' && hour !== 12) h += 12;
  if (period === '오전' && hour === 12) h = 0;

  // "2025-07-31T06:30:00Z" (UTC로 강제 변환)
  const isoStr = new Date(`${date}T${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`).toISOString();
  return isoStr;
};


// 알람 조회 변환
// 상세 정보들 조회 어떻게 하지....
// ? 연산자 활용해서... 있으면 alarm.머시기 없으면 "선택"
export const transformWakeupSummaryToAlarmItem = (
  summary: WakeupAlarmSummary
): AlarmItem => {
  const date = new Date(summary.wakeup_time);
  const hour = date.getHours();
  const minute = date.getMinutes();

  const dayOfWeekMap: Record<number, '일' | '월' | '화' | '수' | '목' | '금' | '토'> = {
    0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토',
  };

  const dayOfWeek = dayOfWeekMap[summary.day];
  const fullDate = summary.wakeup_time.split('T')[0];

  return {
    id: summary.wakeup_alarm_id ?? Date.now(), // fallback ID
    title: `${dayOfWeek}요일 기상 알람`,
    time: {
      period: hour < 12 ? '오전' : '오후',
      hour: hour % 12 === 0 ? 12 : hour % 12,
      minute,
    },
    date: {
      fullDate,
      dayOfWeek,
    },
    sound: '선택',
    vibrate: '선택',
    repeat: '선택',
    memo: '',
    isActive: summary.is_active,
    isSound: false,
    isVibrating: false,
    isRepeating: false,
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