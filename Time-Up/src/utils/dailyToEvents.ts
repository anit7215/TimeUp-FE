// utils/dailyToEvents.ts
/*  import type { UIEvent } from '../components/SetSchedule/ScheduleUI';
import { toHex } from '@/src/utils/colors'; // 색상 유틸리티 함수

// 로컬 타임존 오프셋(+9 같은 것). JS는 분 단위로 주니 시간으로 환산
const tzHours = -new Date().getTimezoneOffset() / 60; // KST이면 9

const toIntendedLocalStartTime = (d: Date) => {
  // 서버가 "로컬 + tz"로 잘못 올린 UTC를 받았다고 가정하고,
  // UTC 기준 시간에서 tz를 빼서 원래 로컬 시간(사용자가 입력한 시간)을 복구
  // 예) 17:00Z - 9h = 08:00 (의도한 값)
  const h = d.getUTCHours() - tzHours;
  const m = d.getUTCMinutes();
  // 음수/24시 초과 보정 + 30분 단위 반영
  const hourNorm = ((h % 24) + 24) % 24;
  return hourNorm + (m >= 30 ? 0.5 : 0);
};

const clampToGrid = (startTime: number, duration: number) => {
  const GRID_START = 6;
  const GRID_END = 24; // 23:30까지 표현
  const s = Math.max(GRID_START, Math.min(startTime, GRID_END - 0.5));
  const e = Math.min(startTime + duration, GRID_END);
  return { startTime: s, duration: Math.max(0.5, e - s) };
};

export const dailyToEvents = (schedules: any[]): UIEvent[] => {
  return (schedules || []).map((s: any) => {
    const start = new Date(s.start_date); // '...Z'
    const end   = new Date(s.end_date);

    const startTimeRaw = toIntendedLocalStartTime(start);
    const ms = Math.max(0, end.getTime() - start.getTime());
    const durationRaw = Math.max(0.5, Math.round(ms / (30 * 60 * 1000)) / 2);

    const { startTime, duration } = clampToGrid(startTimeRaw, durationRaw);

    return {
      id: String(s.schedule_id),
      title: s.name,
      startTime,
      duration,
      color: toHex(s.color),
      scheduleId: String(s.schedule_id),
    } as UIEvent;
  });
};


import type { UIEvent } from '../components/SetSchedule/ScheduleUI';

export const dailyToEvents = (schedules: any[]): UIEvent[] => {
  return (schedules || []).map((s: any) => {
    const start = new Date(s.start_date); // '...Z'
    const end   = new Date(s.end_date);

    // ✅ UTC 기준으로 시간표 표시
    const startHour = start.getUTCHours();
    const startMin  = start.getUTCMinutes();
    const startTime = startHour + (startMin >= 30 ? 0.5 : 0);

    // 30분 단위 duration
    const ms = Math.max(0, end.getTime() - start.getTime());
    const halfHours = Math.round(ms / (30 * 60 * 1000));
    const duration = Math.max(0.5, halfHours / 2);

    return {
      id: String(s.schedule_id),
      title: s.name,
      startTime,   // 21:00이면 21로 렌더됨
      duration,
      color: s.color || 'dodgerblue',
      scheduleId: String(s.schedule_id),
    } as UIEvent;
  });
};

    */
import type { UIEvent } from '../components/SetSchedule/ScheduleUI';
import { toHex } from '@/src/utils/colors'; // 선택: 서버 color 이름→HEX 정규화 쓰는 경우

// 문자열에서 HH:mm만 뽑아 "벽시계" 시간으로 사용 (TZ 무시)
const toWallClockStartTime = (input: string | Date) => {
  if (typeof input === 'string') {
    // 예: '2025-08-15T08:00:00Z', '...+09:00', '2025-08-15 08:00:00' 등 모두 매치
    const m = input.match(/T?(\d{2}):(\d{2})/);
    if (m) {
      const hh = parseInt(m[1], 10);
      const mm = parseInt(m[2], 10);
      return hh + (mm >= 30 ? 0.5 : 0);
    }
  }
  // 혹시 Date 객체가 들어오면 최소한의 폴백(그래도 KST 고정)
  const d = typeof input === 'string' ? new Date(input) : input;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(d);
  const hh = Number(parts.find(p => p.type === 'hour')?.value ?? '0');
  const mm = Number(parts.find(p => p.type === 'minute')?.value ?? '0');
  return hh + (mm >= 30 ? 0.5 : 0);
};

const clampToGrid = (startTime: number, duration: number) => {
  const GRID_START = 6;
  const GRID_END = 24; // 23:30까지 표현
  const s = Math.max(GRID_START, Math.min(startTime, GRID_END - 0.5));
  const e = Math.min(startTime + duration, GRID_END);
  return { startTime: s, duration: Math.max(0.5, e - s) };
};

export const dailyToEvents = (schedules: any[]): UIEvent[] => {
  return (schedules || []).map((s: any) => {
    const startStr = s.start_date as string;
    const endStr   = s.end_date as string;

    // ✅ 시작 시간: TZ 무시하고 문자열의 HH:mm로 계산 → 08:00이면 8로 렌더
    const startTimeRaw = toWallClockStartTime(startStr);

    // ✅ duration은 시작/끝의 차이(ms)로 계산하면 TZ 유무와 무관 (둘 다 같은 표기면 차이는 정확)
    const start = new Date(startStr);
    const end   = new Date(endStr);
    const ms = Math.max(0, end.getTime() - start.getTime());
    const durationRaw = Math.max(0.5, Math.round(ms / (30 * 60 * 1000)) / 2); // 30분 단위

    const { startTime, duration } = clampToGrid(startTimeRaw, durationRaw);

    return {
      id: String(s.schedule_id ?? s.id),
      title: s.name,
      startTime,
      duration,
      color: toHex ? toHex(s.color) : (s.color || 'dodgerblue'), // 선택: color 정규화
      scheduleId: String(s.schedule_id ?? s.id),
    } as UIEvent;
  });
};
