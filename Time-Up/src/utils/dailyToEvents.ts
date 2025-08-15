// utils/dailyToEvents.ts
import type { UIEvent } from '../components/SetSchedule/ScheduleUI';
import { toHex } from '@/src/utils/colors';

// 서버가 "KST 시각 + Z"로 보내는 버그 우회 스위치
const Z_FIX_TREATS_Z_AS_LOCAL = true;

const toWallClockStartTime = (iso: string) => {
  const hasZ = /Z$/i.test(iso);
  const d = new Date(iso);

  let hour: number;
  let min: number;

  if (hasZ && Z_FIX_TREATS_Z_AS_LOCAL) {
    // ✅ "KST 시각에 Z만 붙인" 잘못된 문자열: UTC 부분을 '의도된 로컬'로 사용
    // 예) "2025-08-15T08:00:00Z" → 8로 렌더
    hour = d.getUTCHours();
    min  = d.getUTCMinutes();
  } else {
    // 올바른 UTC or 타임존 표기(+09:00 등) or Z_FIX 해제: 로컬로 표시
    hour = d.getHours();
    min  = d.getMinutes();
  }

  const norm = ((hour % 24) + 24) % 24;
  return norm + (min >= 30 ? 0.5 : 0);
};

const clampToGrid = (startTime: number, duration: number) => {
  // UI가 0~24 그리드이므로 여기도 0 기준으로 맞춥니다.
  const GRID_START = 0;
  const GRID_END = 24;
  const s = Math.max(GRID_START, Math.min(startTime, GRID_END - 0.5));
  const e = Math.min(startTime + duration, GRID_END);
  return { startTime: s, duration: Math.max(0.5, e - s) };
};

export const dailyToEvents = (schedules: any[]): UIEvent[] =>
  (schedules || []).map((s: any) => {
    const startStr = String(s.start_date);
    const endStr   = String(s.end_date);

    const startTimeRaw = toWallClockStartTime(startStr);

    // duration은 ms 차이로 계산(표기 버그와 무관하게 정확)
    const start = new Date(startStr);
    const end   = new Date(endStr);
    const ms = Math.max(0, end.getTime() - start.getTime());
    const halfHours = Math.round(ms / (30 * 60 * 1000));
    const durationRaw = Math.max(0.5, halfHours / 2);

    const { startTime, duration } = clampToGrid(startTimeRaw, durationRaw);

    return {
      scheduleId: String(s.schedule_id ?? s.id ?? s.scheduleId),
      id: String(s.schedule_id ?? s.id ?? s.scheduleId),
      title: s.name,
      startTime,
      duration,
      color: typeof toHex === 'function' ? toHex(s.color) : (s.color ?? 'dodgerblue'),
      url: s.url,
    } as UIEvent;
  });
