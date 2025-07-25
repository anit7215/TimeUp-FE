import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PlusIcon from '../../assets/icons/plusIcon.svg';
import { Schedule } from '../types/schedule';

const route = useRoute();
const { width } = Dimensions.get('window');
const { newSchedule } = route.params as { newSchedule?: Schedule };

const [selectMode, setSelectMode] = useState(false);
const [selectedDate, setSelectedDate] = useState<string | null>(null)

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const navigation = useNavigation<any>();


    const handleAddSchedule = (selectedDate: string) => {
      
    const initialSchedule: Schedule = {
      scheduleId: '', // 등록 전에는 비워두기
      name: '',
      start_date: selectedDate,
      end_date: selectedDate,
      place_name: '',
      address: '',
      color: '#FFB366',
      memo: '',
      is_reminding: false,
      remind_at: 0,
      is_recurring: false,
      is_important: false,
    };

    navigation.navigate('AddSchedule', { schedule: initialSchedule });
  };

  const handleDateSelect = (date: string) => {
    navigation.navigate('AddSchedulePage', { date: selectedDate }) // 날짜 넘김
  };
  
  // 현재 연도와 월 가져오기
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 월 이름 배열
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  // 요일 배열
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // 백엔드에서 일정 데이터를 가져오는 함수 (예시)
  const fetchEvents = async (year, month) => {
    try {
      // 실제 API 호출 예시
      // const response = await fetch(`/api/events?year=${year}&month=${month + 1}`);
      // const data = await response.json();
      
      // 임시 데이터 (실제로는 백엔드에서 받아올 데이터)
      const mockData = {
        '2025-7-3': 2,   // 7월 3일에 2개 일정
        '2025-7-15': 1,  // 7월 15일에 1개 일정
        '2025-7-20': 3,  // 7월 20일에 3개 일정
        '2025-7-25': 1,  // 7월 25일에 1개 일정
      };
      
      setEvents(mockData);
    } catch (error) {
      console.error('일정 데이터 가져오기 실패:', error);
    }
  };
  
  // 월이 변경될 때마다 일정 데이터 가져오기
  useEffect(() => {
    fetchEvents(year, month);
  }, [year, month]);
  
  // 특정 날짜의 일정 개수 가져오기
  const getEventCount = (date) => {
    const dateKey = `${year}-${month + 1}-${date}`;
    return events[dateKey] || 0;
  };
  
  // 일정 dot 렌더링
  const renderEventDots = (eventCount) => {
    if (eventCount === 0) return null;
    
    const dots = [];
    const maxDots = 3; // 최대 3개까지만 표시
    const actualDots = Math.min(eventCount, maxDots);
    
    for (let i = 0; i < actualDots; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.eventDot,
            { marginLeft: i > 0 ? 2 : 0 }
          ]}
        />
      );
    }
    
    return (
      <View style={styles.eventDotsContainer}>
        {dots}
        {eventCount > maxDots && (
          <Text style={styles.moreEventsText}>+{eventCount - maxDots}</Text>
        )}
      </View>
    );
  };
  
  // 해당 월의 첫째 날과 마지막 날 구하기
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 해당 월의 첫째 날이 무슨 요일인지 (0: 일요일, 1: 월요일, ...)
  const firstDayOfWeek = firstDay.getDay();
  
  // 해당 월의 총 일수
  const daysInMonth = lastDay.getDate();
  
  // 캘린더 날짜 배열 생성
  const calendarDays = [];
  
  // 이전 달의 마지막 날짜들 (빈 공간 채우기)
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthLastDay - i,
      isCurrentMonth: false,
      isPrevMonth: true
    });
  }
  
  // 현재 달의 날짜들
  for (let date = 1; date <= daysInMonth; date++) {
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isPrevMonth: false
    });
  }
  
  // 다음 달의 첫 날짜들 (빈 공간 채우기)
  const remainingCells = 42 - calendarDays.length; // 6주 * 7일 = 42칸
  for (let date = 1; date <= remainingCells; date++) {
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isPrevMonth: false
    });
  }
  
  // 이전/다음 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };
  
  // 오늘 날짜 확인
  const today = new Date();
  const isToday = (date) => {
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === date;
  };
  
  const handleDatePress = (day) => {
      navigation.navigate('SchedulePage', { date: `${year}-${month + 1}-${day.date}` }); // 날짜 넘김
      handleDateSelect(`${year}-${month + 1}-${day.date}`); // 날짜 넘김
    
  };
  
  const renderCalendarDays = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      const week = calendarDays.slice(i, i + 7);
      weeks.push(
        <View key={i} style={styles.weekRow}>
          {week.map((day, index) => {
            const isSelected = selectedDate === day.date && day.isCurrentMonth;
            const isTodayDate = isToday(day.date) && day.isCurrentMonth;
            const dayIndex = (i / 7) * 7 + index;
            const eventCount = day.isCurrentMonth ? getEventCount(day.date) : 0;
            
            return (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.dayCell,
                  isTodayDate && styles.todayCell,
                  isSelected && styles.selectedCell,
                ]}
                onPress={() => handleDatePress(day)}
                activeOpacity={0.7}
              >
              
                <Text
                  style={[
                    styles.dayText,
                    !day.isCurrentMonth && styles.otherMonthText,
                    isTodayDate && styles.todayText,
                    isSelected && styles.selectedText,
                    day.isCurrentMonth && index === 0 && styles.sundayText,
                    day.isCurrentMonth && index === 6 && styles.saturdayText,
                  ]}
                >
                  {day.date}
                </Text>
                {renderEventDots(eventCount)}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return weeks;
  };
  
  return (
    <View style={styles.container}>
      <View className="absolute top-0 left-0 right-0 z-10 mt-4 mb-4">
        <TouchableOpacity 
          style={{ position: 'absolute', top: 20, right: 20 }}
          onPress={() => handleAddSchedule(`${year}-${month + 1}-${selectedDate}`)} // 날짜 불투명 설정하고 선택한 날짜는 동그라미 표시되도록 함
          activeOpacity={0.7}
        >
          <PlusIcon width={36} height={36} />
        </TouchableOpacity>
      </View>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {year}년 {monthNames[month]}
        </Text>
        <View style={styles.navButtonContainer}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={goToPrevMonth}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>{'<'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={goToNextMonth}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* border */}
      <View style={styles.borderLine} />

      {/* 요일 헤더 */}
      <View style={styles.weekHeaderRow}>
        {dayNames.map((day, index) => (
          <View key={day} style={styles.weekHeaderCell}>
            <Text 
              style={[
                styles.weekHeaderText,
                index === 0 && styles.sundayHeaderText,
                index === 6 && styles.saturdayHeaderText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
      
      {/* 날짜 그리드 */}
      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 2
  },
  navButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 10,
    borderRadius: 20,
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 30,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '500',
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    marginBottom: 16,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekHeaderText: {
    color: '#F7F7FE',
    fontSize: 20,
    fontWeight: '500',
  },
  sundayHeaderText: {
    color: '#E50000',
  },
  saturdayHeaderText: {
    color: '#224CF1',
  },
  calendarGrid: {
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#4dabf7',
  },
  selectedCell: {
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  dayText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '400',
  },
  otherMonthText: {
    color: '#121212',
  },
  todayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sundayText: {
    color: '#E50000',
  },
  saturdayText: {
    color: '#224CF1',
  },
  eventDotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#4dabf7', // 색상 불러오기
  },
  moreEventsText: {
    color: '#4dabf7',
    fontSize: 8,
    marginLeft: 2,
  },
});

export default CustomCalendar;