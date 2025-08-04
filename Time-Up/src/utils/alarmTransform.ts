// src/utils/alarmTransform.ts
import { AlarmItem, MyAlarmSummary, PostMyAlarmRequest, PutMyAlarmRequest } from '@/src/types/alarm';
import moment from 'moment-timezone';

type AlarmWithoutId = Omit<AlarmItem, 'id'>;

// 서버 응답(MyAlarmSummary) → 화면용 알람(AlarmItem)으로 변환
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
      fullDate: '2025-08-01',
      dayOfWeek: '월',
    },
    sound: '선택',
    vibrate: '선택',
    repeat: '선택',
    memo: '',
    isActive: alarm.is_active,
  };
};


//AlarmItem → PostMyAlarmRequest 변환
export const toPostMyAlarmRequest = (alarm: AlarmWithoutId): PostMyAlarmRequest => {  const { date, time, title, memo, isActive, sound, vibrate, repeat } = alarm;

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
  let repeat_interval = 10;
  let repeat_count = 5;

  if (repeat) {
    const [intervalStr, countStr] = repeat.split(',').map(s => s.trim());
    if (intervalStr?.includes('분')) {
      repeat_interval = parseInt(intervalStr.replace('분', ''), 10);
    }
    if (countStr?.includes('회')) {
      repeat_count = parseInt(countStr.replace('회', ''), 10);
    }
  }

  return {
    my_alarm_name: title,
    my_alarm_time: alarmTime,
    is_active: isActive,
    is_repeating: true,
    is_sound: sound !== '선택',
    is_vibrating: vibrate !== '선택',
    vibration_type: convertToVibrationType(vibrate),
    sound_id: convertToSoundId(sound),
    repeat_interval,
    repeat_count,
    memo,
  };
};


// 화면용 알람(AlarmItem) → 등록 요청(PutMyAlarmRequest)
export const transformAlarmToPostRequest = (alarm: AlarmItem): PutMyAlarmRequest => {
  return {
    my_alarm_name: alarm.title,
    my_alarm_time: convertTimeTo24Hour(alarm.time),
    is_active: alarm.isActive,
    is_repeating: alarm.repeat !== '선택',
    is_sound: alarm.sound !== '선택',
    is_vibrating: alarm.vibrate !== '선택',
    vibration_type: convertToVibrationType(alarm.vibrate),
    sound_id: convertToSoundId(alarm.sound), // TODO: sound 매핑 필요
    repeat_interval: extractInterval(alarm.repeat),
    repeat_count: extractCount(alarm.repeat),
    memo: alarm.memo,
  };
};

// AlarmItem → PutMyAlarmRequest 변환 (PUT용)
export const toPutMyAlarmRequest = (alarm: AlarmItem): PutMyAlarmRequest => {
  const { date, time, title, memo, isActive, sound, vibrate, repeat } = alarm;

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

  // repeat 유효성 체크 추가
  let repeat_interval = 0;
  let repeat_count = 0;

  if (repeat && repeat.includes(',')) {
    const [intervalStr, countStr] = repeat.split(',').map((s) => s.trim());
    repeat_interval = parseInt(intervalStr.replace('분', ''), 10) || 0;
    repeat_count = parseInt(countStr.replace('회', ''), 10) || 0;
  }

  return {
    my_alarm_name: title,
    my_alarm_time: alarmTime,
    is_active: isActive,
    is_repeating: repeat !== '선택' && repeat.includes(','),
    is_sound: sound !== '선택',
    is_vibrating: vibrate !== '선택',
    vibration_type: convertToVibrationType(vibrate),
    sound_id: convertToSoundId(sound),
    repeat_interval,
    repeat_count,
    memo,
  };
};

// 화면용 알람(AlarmItem) → 수정 요청(PutMyAlarmRequest)
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
