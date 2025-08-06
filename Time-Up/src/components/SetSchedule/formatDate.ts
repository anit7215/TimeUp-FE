import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

export const formatKoreanDate = (dateString: string): string => {
    const date = dayjs(dateString);
    const month = date.month() + 1;
    const day = date.date();
    const weekday = date.format('ddd');
        
    return `${month}월 ${day}일 ${weekday}요일`;
}

export const formatMonthDay = (dateString: string): string => {
    const date = dayjs(dateString);
    const month = date.month() + 1;
    const day = date.date();
        
    return `${month}월 ${day}일`;
}

export const timeOnly = (dateString: string) : string => {
    const time = dayjs(dateString ).format('HH:mm')
    return time;
};