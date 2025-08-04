import { AlarmItem } from '@/src/types/alarm';

// 임시 기상알람 테스트 상태
export const createDefaultWakeupAlarm = (dayOfWeek: string): AlarmItem => ({
  id: Date.now(),
  title: `${dayOfWeek}요일 기상 알람`,
  time: {
    period: '오전',
    hour: 8,
    minute: 0,
  },
  date: {
    fullDate: '2025-01-01',
    dayOfWeek,
  },
  sound: '선택',
  vibrate: '선택',
  repeat: '선택',
  memo: '',
  isActive: true,
  isSound: false,
  isVibrating: false,
  isRepeating: false,
});
