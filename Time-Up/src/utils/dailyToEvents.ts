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
