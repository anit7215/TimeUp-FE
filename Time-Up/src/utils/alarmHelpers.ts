// src/utils/alarmHelpers.ts
export const generateWakeupAlarmTitle = (dayOfWeek: '월' | '화' | '수' | '목' | '금' | '토' | '일'): string => {
  return `${dayOfWeek}요일 기상 알람`;
};
