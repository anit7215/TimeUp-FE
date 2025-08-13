import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchDaySchedule } from '../apis/schedule';
import ScheduleUI from '../components/SetSchedule/ScheduleUI';

interface BackendEvent {
  scheduleId: string;
  title: string;
  start_date: string; // ISO string format
  end_date: string;   // ISO string format
  color?: string;
}

interface UIEvent {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  color: string;
  scheduleId: string; // 상세 페이지 이동을 위한 ID
}

const SchedulePage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedDate } = route.params as { selectedDate: string };
  
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // 시간 차이를 계산하여 duration을 구하는 함수
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.max(1, Math.ceil(diffInHours)); // 최소 1시간
  };

  // ISO 시간에서 시간(hour)만 추출하는 함수
  const extractHour = (dateString: string): number => {
    const date = new Date(dateString);
    return date.getHours();
  };

  // 백엔드 데이터를 UI 형식으로 변환하는 함수
  const transformBackendDataToUI = (backendEvents: BackendEvent[]): UIEvent[] => {
    return backendEvents.map((event) => ({
      id: event.scheduleId,
      scheduleId: event.scheduleId,
      title: event.title,
      startTime: extractHour(event.start_date),
      duration: calculateDuration(event.start_date, event.end_date),
      color: event.color || '#FFB366', // 기본 색상 설정
    }));
  };

  useEffect(() => {
    const loadScheduleData = async () => {
      try {
        setLoading(true);
        const response = await fetchDaySchedule(selectedDate);
        
        // response.data가 배열이라고 가정
        const backendEvents: BackendEvent[] = response.data || [];
        const uiEvents = transformBackendDataToUI(backendEvents);
        
        setEvents(uiEvents);
      } catch (error) {
        console.error('스케줄 데이터 로딩 실패:', error);
        Alert.alert('오류', '스케줄 데이터를 불러오는데 실패했습니다.');
        setEvents([]); // 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, [selectedDate]);

  const handleEventPress = (event: UIEvent) => {
    // ViewScheduleDetailPage로 이동하면서 scheduleId 전달
    navigation.navigate('ViewScheduleDetailPage', { 
      scheduleId: event.scheduleId 
    });
  };

  const handleTimeSlotPress = (time: number) => {
    Alert.alert('시간 선택', `${time}시를 선택했습니다.`);
    // 필요시 새 일정 생성 페이지로 이동하는 로직 추가 가능
    // navigation.navigate('CreateSchedulePage', { selectedDate, selectedTime: time });
  };

  if (loading) {
    // 로딩 상태 처리 (필요시 로딩 컴포넌트로 교체)
    return (
      <ScheduleUI
        date={selectedDate}
        events={[]}
        onEventPress={handleEventPress}
        onTimeSlotPress={handleTimeSlotPress}
      />
    );
  }

  return (
    <ScheduleUI
      date={selectedDate}
      events={events}
      onEventPress={handleEventPress}
      onTimeSlotPress={handleTimeSlotPress}
    />
  );
};

export default SchedulePage;