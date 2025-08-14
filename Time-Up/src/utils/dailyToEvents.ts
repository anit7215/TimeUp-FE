// utils/dailyToEvents.ts
import type { UIEvent } from '../components/SetSchedule/ScheduleUI';
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

/* 
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
