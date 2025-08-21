/* import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

export const formatKoreanDate = (dateString: string): string => {
    const date = dayjs(dateString);
    const month = date.month() + 1;
    const day = date.date();
    const weekday = date.format('ddd');
        
    return `${month}월 ${day}일 ${weekday}요일`;
}



export const timeOnly = (dateString: string) : string => {
    const time = dayjs(dateString ).format('HH:mm')
    return time;
}; */
// components/SetSchedule/formatDate.ts
import dayjs from 'dayjs';
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');

// 백엔드 임시버그: "KST 시각 + Z"를 보정할지 여부
const Z_FIX_TREATS_Z_AS_LOCAL = false;

const asMomentForDisplay = (iso?: string | null) => {
  if (!iso) return null;
  const s = String(iso);
  // '...Z'가 붙어 있고, 보정 스위치가 켜져 있으면
  // -> UTC로 포맷 = 숫자 그대로(08:00)는 08:00로 보임 (추가 +9 없음)
  if (Z_FIX_TREATS_Z_AS_LOCAL && /Z$/i.test(s)) {
    return moment.utc(s);
  }
  // 그 외는 일반 로컬 포맷
  return moment(s);
};

export const formatKoreanDate = (iso?: string | null) => {
  const m = asMomentForDisplay(iso);
  if (!m) return '';
  // 예: 2025년 8월 15일 (금)
  return m.format('YYYY년 M월 D일 (dd)');
};

export const timeOnly = (iso?: string | null) => {
  const m = asMomentForDisplay(iso);
  if (!m) return '';
  // 예: 08:00
  return m.format('HH:mm');
};

export const formatMonthDay = (dateString: string): string => {
    const date = dayjs(dateString);
    const month = date.month() + 1;
    const day = date.date();
        
    return `${month}월 ${day}일`;
}
