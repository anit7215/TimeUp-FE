import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

export const formatKoreanDate = (dateString: string): string => {
    const date = dayjs(dateString);
    const month = date.month() + 1;
    const day = date.date();
    const weekday = date.format('ddd');
        
    return `${month}월 ${day}일 (${weekday})`;
}

export const timeOnly = dayjs('2023-10-01T15:00:00').format('HH:mm');