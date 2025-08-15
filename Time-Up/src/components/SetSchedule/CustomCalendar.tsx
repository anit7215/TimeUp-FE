import moment from 'moment';
import 'moment/locale/ko';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

moment.locale('ko');

type CalendarDate = {
  dateString: string; // 'YYYY-MM-DD'
  day: number;
  month: number;      // 1~12
  year: number;
  timestamp: number;  // ms
};

interface CustomCalendarProps {
  initialDate?: string;            // 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
}

export default function CustomCalendar({ initialDate, onSelectDate }: CustomCalendarProps) {
  // 선택된 날짜(하이라이트)
  const [selectedDate, setSelectedDate] = useState(
    initialDate || moment().format('YYYY-MM-DD')
  );

  // 보이는 달(헤더/화살표 조작용, 'YYYY-MM')
  const [visibleMonth, setVisibleMonth] = useState(
    initialDate ? initialDate.slice(0, 7) : moment().format('YYYY-MM')
  );

  const currentForCalendar = `${visibleMonth}-01`;

  const markedDates = useMemo(
    () => ({
      [selectedDate]: { selected: true, selectedColor: 'blue' },
    }),
    [selectedDate]
  );

  return (
    <View>
      <Calendar
        // 보이는 달 제어
        current={currentForCalendar}
        theme={{
          calendarBackground: '#33363B',
          textDisabledColor: 'gray',
        }}
        markedDates={markedDates}
        // 화살표로 달 바뀔 때
        onMonthChange={(m: CalendarDate) => {
          const next = `${m.year}-${String(m.month).padStart(2, '0')}`;
          setVisibleMonth(next);
        }}
        // 날짜 클릭 시
        onDayPress={(day: CalendarDate) => {
          setSelectedDate(day.dateString);
          onSelectDate(day.dateString);
          // 선택한 날짜의 달로 헤더 이동 원하면 유지
          setVisibleMonth(day.dateString.slice(0, 7));
        }}
        // 헤더는 visibleMonth 기반 표기
        renderHeader={() => {
          const headerText = moment(`${visibleMonth}-01`).format('M월 YYYY');
          return (
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
              {headerText}
            </Text>
          );
        }}
        // 커스텀 Day
        dayComponent={({ date, state }) => {
          if (!date) return null;

          const day = date.day;
          const dateString = date.dateString;
          const dayOfWeek = new Date(dateString).getDay();
          const isSelected = dateString === selectedDate;

          const getTextColor = () => {
            if (state === 'disabled') return 'gray';
            if (isSelected) return 'white';
            if (dayOfWeek === 0) return '#FF3B30'; // 일
            if (dayOfWeek === 6) return '#007AFF'; // 토
            return 'white';
          };

          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(dateString);
                onSelectDate(dateString);
                setVisibleMonth(dateString.slice(0, 7));
              }}
            >
              <View
                className={`w-10 h-10 justify-center items-center rounded-full ${
                  isSelected ? 'bg-blue-600' : ''
                }`}
              >
                <Text style={{ color: getTextColor(), fontSize: 16 }}>{day}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
