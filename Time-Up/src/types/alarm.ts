// src/types/alarm.ts
export interface MyAlarm {
  id: string;
  title: string;
  time: {
    period: '오전' | '오후' | '없음';
    hour: number;
    minute: number;
  };
  date: {
    fullDate: string;     // '2025-06-27'
    dayOfWeek: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  };
  sound: string;
  vibrate: boolean;
  repeat: string;
  memo: string;
  isActive: boolean;
}
