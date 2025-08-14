import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PlusIcon from '../../assets/icons/plusIcon.svg';
import Modal from '../components/common/Modal';
import { formatMonthDay } from '../components/SetSchedule/formatDate';
import ImportantScheduleModal from '../components/SetSchedule/ImportantScheduleModal';
import { useSchedule } from '../context/ScheduleContext';
import { toYyyyMm } from '../utils/userTimeFormat';
import { getSchedules } from '../apis/schedule'; // 백엔드에서 일정 데이터를 가져오는 함수

const { width, height } = Dimensions.get('window');

const CalendarPage = () => {
  const navigation = useNavigation<any>();
  const { dispatch } = useSchedule();
  
  // State 관리
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDaySelected, setIsDaySelected] = useState(false);
  const [events, setEvents] = useState<Record<string, { count: number; colors: string[] }>>({});
  const [isPlusButtonPressed, setIsPlusButtonPressed] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 중요 일정 조회
  const schedules = [
    {
      scheduleId: '1',
      name: '옷 사기',
      start_date: '2025-07-15T10:00:00',
      end_date: '2025-07-15T12:00:00',
      color: '#FF6B6B',
      is_important: true,
      place_name: '회의실 A',
    },
    {
      scheduleId: '2',
      name: '프로젝트 마감',
      start_date: '2025-07-15T10:00:00',
      end_date: '2025-07-15T12:00:00',
      color: '#4ECDC4',
      is_important: true,
      place_name: '회의실 B'
    }
  ];

  const toDateKey = (isoOrDate: string | Date) => {
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    const y = d.getFullYear();
    const m = d.getMonth() + 1;      // 1~12 (0 padding 없이)
    const day = d.getDate();         // 1~31 (0 padding 없이)
    return `${y}-${m}-${day}`;
  };

  const buildDotsFromByDay = (
    schedulesByDay: Record<string, { color: string, scheduleId?: string }[]>,
    year: number,
    monthIndex0: number // 0~11
  ) => {
    const map: Record<string, { count: number; colors: string[] }> = {};
  
    Object.entries(schedulesByDay || {}).forEach(([dayStr, arr]) => {
      const day = Number(dayStr); // "8" -> 8
      const key = `${year}-${monthIndex0 + 1}-${day}`; // getEventCount 포맷과 동일

      // 중복 제거를 위해 Map 사용
      // scheduleId가 없으면 color와 랜덤값으로 고유 ID 생성
      const uniqueSchedules = new Map();

      (arr|| []).forEach(item => {
        const id = item.scheduleId || `${item.color}-${Math.random()}`;
        if (!uniqueSchedules.has(id)) {
          uniqueSchedules.set(id, item.color);
        }
      });
  
      // 색상 배열(최대 6개까지만 도트로 표시)
      const colors = Array.from(uniqueSchedules.values()).slice(0, 6);
  
      map[key] = {
        count: uniqueSchedules.size, // 실제 일정 개수
        colors,
      };
    });
  
    return map;
  };

  const loadMonth = async (dateOrISO: Date | string) => {
    try {
      const monthKey = toYyyyMm(dateOrISO);     // '2025-08'
      const res = await getSchedules(monthKey); 
  
      const d = typeof dateOrISO === 'string' ? new Date(dateOrISO) : dateOrISO;
      const y = d.getFullYear();
      const mIndex0 = d.getMonth();
  
      const byDay = res?.success?.schedulesByDay || {};
      setEvents(buildDotsFromByDay(byDay, y, mIndex0)); 
      setSelectedMonth(monthKey);
      console.log(res?.status, res?.result, res?.success);
    } catch (e) {
      console.error('월별 일정 조회 실패:', e);
      setEvents({});
    }
  };
  

  useEffect(() => {
    if (selectedDate && isPlusButtonPressed) {
      setModalOpen(true);
      setIsPlusButtonPressed(false);
     }
    }, [selectedDate, isPlusButtonPressed]);
  
  // 선택된 월을 표시하기 위한 상태
  const [selectedMonth, setSelectedMonth] = useState(
    `${year}-${String(month + 1).padStart(2, '0')}`
  );
  const [isModalVisible, setIsModalVisible] = useState(true); // 항상 표시되도록 true로 설정




  // 중요 일정 모달 열기 함수 추가
  const openImportantScheduleModal = () => {
    setIsModalVisible(true);
  };

  const closeImportantScheduleModal = () => {
    setIsModalVisible(false);
  };

  // selectedMonth 업데이트 (월이 변경될 때마다)
  useEffect(() => {
    setSelectedMonth(`${year}-${String(month + 1).padStart(2, '0')}`);
  }, [year, month]);
  
  // 월 이름 배열
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  // 요일 배열
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 백엔드에서 일정 데이터를 가져오는 함수
useEffect(() => {
  loadMonth(currentDate);
}, [currentDate]);

  const handleAddSchedule = (date: string) => { // 이건 모달창 뜨고 확인 버튼 누르고 나서 이뤄져야 할 로직
    const dateToUse = selectedDate;
    console.log('선택된 날짜:', dateToUse);

    dispatch({ type: 'RESET_DRAFT'});
    dispatch({ type: 'UPDATE_DRAFT', payload: { start_date: dateToUse, end_date: dateToUse}})
    navigation.navigate('AddSchedulePage');
  };

  // 날짜 선택 핸들러
  const handleDatePress = (day: any) => { // 이거 any타입이어도 될지 모르겠다...
    const dateString = `${year}-${month + 1}-${day.date}`;
    navigation.navigate('SchedulePage', { selectedDate: dateString }) // selectedDate 삭제
    
  };
  
  // 특정 날짜의 일정 개수 가져오기
  const getEventCount = (date: number) => {
    const dateKey = `${year}-${month + 1}-${date}`;
    return events[dateKey]?.count || 0;
  };
  
  // 일정 dot 렌더링
  const renderEventDots = (colors: string[], totalCount: number) => {
    if (!totalCount) return null;
  
    const maxDots = 6;
    const dotsToShow = colors.slice(0, maxDots);
  
    return (
      <View style={styles.eventDotsContainer}>
        {dotsToShow.map((c, i) => (
          <View
            key={i}
            style={[
              styles.eventDot,
              { marginLeft: i > 0 ? 2 : 0, backgroundColor: c },
            ]}
          />
        ))}
        {totalCount > maxDots && (
          <Text style={styles.moreEventsText}>+{totalCount - maxDots}</Text>
        )}
      </View>
    );
  };
  
  // 캘린더 날짜 배열 생성
  const generateCalendarDays = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
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
    
    return calendarDays;
  };
  
  // 이전/다음 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
    setSelectedDate(''); // 선택된 날짜 초기화
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
    setSelectedDate(''); // 선택된 날짜 초기화
  };
  
  // 오늘 날짜 확인
  const isToday = (date: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === date;
  };
  
  // 캘린더 날짜 렌더링
  const renderCalendarDays = () => {
    const calendarDays = generateCalendarDays();
    const weeks = [];
    
    for (let i = 0; i < calendarDays.length; i += 7) {
      const week = calendarDays.slice(i, i + 7);
      weeks.push(
        <View key={i} style={styles.weekRow}>
          {week.map((day, index) => {
            const dateString = `${year}-${month + 1}-${day.date}`;
            const isSelected = selectedDate === dateString && day.isCurrentMonth;
            const isTodayDate = isToday(day.date) && day.isCurrentMonth;
            const dayIndex = (i / 7) * 7 + index;
            const eventCount = day.isCurrentMonth ? getEventCount(day.date) : 0;
            const colors = day.isCurrentMonth ? events[dateString]?.colors || [] : [];
            
            return (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.dayCell,
                  isSelected && styles.selectedCell,
                ]}

                // 날짜 클릭 시
                onPress={() => {
                  if (isPlusButtonPressed) {
                    setSelectedDate(dateString); // 1. 날짜 저장
                  } else {
                    handleDatePress(day); // 상세조회
                  }
                }}

                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    {opacity: isPlusButtonPressed ? 0.5 : 1},
                    !day.isCurrentMonth && styles.otherMonthText,
                    isDaySelected && styles.selectedCircle,
                    isTodayDate && styles.todayText,
                    isSelected && styles.selectedText,
                    day.isCurrentMonth && index === 0 && styles.sundayText,
                    day.isCurrentMonth && index === 6 && styles.saturdayText,
                  ]}
                >
                  {day.date}
                </Text>
                {renderEventDots(colors, eventCount)}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return weeks;
  };
  
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* 플러스 버튼 */}
      <View className="absolute top-0 left-0 right-0 z-10 mt-4 mb-4">
        <TouchableOpacity 
          style={{ position: 'absolute', top: 20, right: 20 }}
          onPress={() => setIsPlusButtonPressed(true)}
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
        {ModalOpen && (
          <Modal
            onClose={() => {
              setModalOpen(false);
              setIsDaySelected(false);
              setSelectedDate(''); // 모달 닫을 때 선택된 날짜 초기화
            }}
            onConfirm={() => handleAddSchedule(selectedDate)}
          >
            {`${formatMonthDay(selectedDate)}에 일정을 추가하시겠습니까?`}
          </Modal>
        )}

    {/* ImportantScheduleModal을 GestureHandlerRootView 내부로 이동 */}
    <ImportantScheduleModal
      selectedMonth={selectedMonth}
      schedules={schedules}
      isVisible={isModalVisible}
      onClose={closeImportantScheduleModal}
    />
  </GestureHandlerRootView>
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
    fontSize: width > 400 ? 24 : 20, // 화면 크기에 따라 폰트 크기 조정
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
    fontSize: width > 400 ? 16 : 14, // 화면 크기에 따라 폰트 크기 조정
    fontWeight: '500',
  },
  sundayHeaderText: {
    color: '#E50000',
  },
  saturdayHeaderText: {
    color: '#224CF1',
  },
  calendarGrid: {
    flex: 1, // 남은 공간을 모두 사용
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    flex: 1, // 각 주가 균등하게 공간을 차지
  },
  dayCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    position: 'relative',
    minHeight: (height - 300) / 7, // 화면 높이에 따라 최소 높이 설정
  },
  selectedCell: {
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  dayText: {
    color: '#ffffff',
    fontSize: width > 400 ? 18 : 16, // 화면 크기에 따라 폰트 크기 조정
    fontWeight: '400'
  },
  selectedCircle: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ffffff',
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
    width: width > 400 ? 8 : 6, // 화면 크기에 따라 dot 크기 조정
    height: width > 400 ? 8 : 6,
    borderRadius: width > 400 ? 4 : 3,
    backgroundColor: '#4dabf7',
  },
  moreEventsText: {
    color: '#4dabf7',
    fontSize: width > 400 ? 8 : 6, // 화면 크기에 따라 폰트 크기 조정
    marginLeft: 2,
  },
  // 중요 일정 버튼 스타일 추가
  importantScheduleButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  importantScheduleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CalendarPage;
