// src/utils/Alarmformat.ts
import { MyAlarm } from '../types/alarm';

export const formatTime = (time: MyAlarm['time']) => {
  const hourStr = String(time.hour).padStart(2, '0');
  const minuteStr = String(time.minute).padStart(2, '0');
  return `${time.period} ${hourStr} : ${minuteStr}`;
};

export const formatDate = (date: MyAlarm['date']) => {
  const [year, month, day] = date.fullDate.split('-');
  return `${parseInt(month)}월 ${parseInt(day)}일 (${date.dayOfWeek})`;
};
