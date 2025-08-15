// src/utils/alarmTransform.ts
import { AlarmItem, MyAlarmSummary, PostMyAlarmRequest, PutMyAlarmRequest, UpdateWakeupAlarmRequest, WakeupAlarmSummary } from '@/src/types/alarm';
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
// 상세 정보들 조회 어떻게 하지...
// ? 연산자 활용해서... 있으면 alarm.머시기 없으면 "선택"
export const transformWakeupSummaryToAlarmItem = (summary: WakeupAlarmSummary): AlarmItem => {
  // 서버가 주는 ISO Z(UTC) 그대로 시간/분을 읽는다
  const d = new Date(summary.wakeup_time);
  const hourUTC = d.getUTCHours();
  const minuteUTC = d.getUTCMinutes();

  // 요일은 서버가 준 day(0=일, 6=토)를 신뢰
  const dayOfWeekMap: Record<number, '일' | '월' | '화' | '수' | '목' | '금' | '토'> = {
    0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토',
  };
  const dayOfWeek = dayOfWeekMap[summary.day];

  // 날짜 문자열도 UTC 기준 그대로 잘라서 사용
  const fullDate = summary.wakeup_time.slice(0, 10); // 'YYYY-MM-DD'

  const period: '오전' | '오후' = hourUTC < 12 ? '오전' : '오후';
  const hour12 = hourUTC % 12 === 0 ? 12 : hourUTC % 12;

  return {
    id: summary.wakeup_alarm_id ?? Date.now(), // 필요 시 대체 ID
    serverId: summary.wakeup_alarm_id,
    title: `${dayOfWeek}요일 기상 알람`,
    time: {
      period,
      hour: hour12,
      minute: minuteUTC,
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

// MyAlarmSummary → AlarmItem
// export const transformAlarmResponseToItem = (alarm: MyAlarmSummary): AlarmItem => {
//   const dayNames: Record<number, '일' | '월' | '화' | '수' | '목' | '금' | '토'> = {
//     0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토',
//   };

//   const raw = alarm.my_alarm_time;
//   const isISO = /\d{4}-\d{2}-\d{2}T/.test(raw);

//   // Asia/Seoul 기준 파싱
//   const today = moment().tz('Asia/Seoul').format('YYYY-MM-DD');
//   const m = isISO
//     ? moment.tz(raw, 'Asia/Seoul')
//     : /^\d{2}:\d{2}:\d{2}$/.test(raw)
//       ? moment.tz(`${today} ${raw}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul')
//       : moment.tz(`${today} ${raw}`, 'YYYY-MM-DD HH:mm', 'Asia/Seoul');

//   const hour24 = m.hour();
//   const minute = m.minute();
//   const period: '오전' | '오후' = hour24 < 12 ? '오전' : '오후';
//   const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

//   const fullDate = m.format('YYYY-MM-DD');
//   const dayOfWeek = dayNames[m.day()];

//   return {
//     id: alarm.alarm_id ?? Date.now()-Math.random(),     // 서버 id 없을 때 임시 fallback
//     title: alarm.my_alarm_name,
//     time: { period, hour: hour12, minute },
//     date: { fullDate, dayOfWeek },
//     sound: '선택',
//     vibrate: '선택',
//     repeat: '선택',
//     memo: '',
//     isActive: !!alarm.is_active,
//     isSound: false,
//     isVibrating: false,
//     isRepeating: false,
//   };
// };

// export const transformMyAlarmSummaryToItem = transformAlarmResponseToItem;

// 내 알람 조회 변환
export const transformAlarmResponseToItem = (alarm: MyAlarmSummary): AlarmItem => {
  const dayNames: Record<number, '일' | '월' | '화' | '수' | '목' | '금' | '토'> = {
    0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토',
  };

  const raw = alarm.my_alarm_time;

  // 시간 파싱: ISO(UTC Z) → KST, 아니면 KST 기준으로 파싱
  const m = /\d{4}-\d{2}-\d{2}T/.test(raw)
    ? moment.utc(raw).tz('Asia/Seoul')
    : (/^\d{2}:\d{2}:\d{2}$/.test(raw)
        ? moment.tz(`${moment().tz('Asia/Seoul').format('YYYY-MM-DD')} ${raw}`, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul')
        : moment.tz(`${moment().tz('Asia/Seoul').format('YYYY-MM-DD')} ${raw}`, 'YYYY-MM-DD HH:mm', 'Asia/Seoul'));

  const hour24 = m.hour();
  const minute = m.minute();
  const period: '오전' | '오후' = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  const fullDate = m.format('YYYY-MM-DD');
  const dayOfWeek = dayNames[m.day()];

  // 고유 id 보강: 서버 id 없을 때 시간(ms) + 이름 해시
  const base = m.valueOf();
  const nameSeed = (alarm.my_alarm_name || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const safeId = (alarm as any).alarm_id ?? (base + nameSeed);

  return {
    id: safeId,
    serverId: alarm.alarm_id,
    title: alarm.my_alarm_name,
    time: { period, hour: hour12, minute },
    date: { fullDate, dayOfWeek },
    sound: '선택',
    vibrate: '선택',
    repeat: '선택',
    memo: '',
    isActive: !!alarm.is_active,
    isSound: false,
    isVibrating: false,
    isRepeating: false,
  };
};

export const transformMyAlarmSummaryToItem = transformAlarmResponseToItem;



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