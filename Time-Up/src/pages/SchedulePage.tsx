import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getDailySchedules } from '../apis/schedule'; // 경로는 네 프로젝트 구조에 맞게
import type { UIEvent }from '../components/SetSchedule/ScheduleUI';
import ScheduleUI from '../components/SetSchedule/ScheduleUI';
import { dailyToEvents } from '../utils/dailyToEvents';

type ParamList = {
  SchedulePage: { selectedDate: string }; // 'YYYY-M-D' 형태로 들어올 수 있음
};

const padISO = (dateStr: string) => {
  // 'YYYY-M-D' → 'YYYY-MM-DD'
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

const SchedulePage = () => {
  const route = useRoute<RouteProp<ParamList, 'SchedulePage'>>();
  const navigation = useNavigation<any>();

  const { selectedDate } = route.params; // 전달받은 원본(패딩 없음 가능)
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [dateISO, setDateISO] = useState(() => padISO(selectedDate));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const iso = padISO(selectedDate);
        setDateISO(iso);

        const res = await getDailySchedules(iso);

        console.log('일별 조회 status:', res?.status);
        console.log('일별 조회 결과:', res?.success?.schedules);
        if (res?.status === 200) {
          const list = res?.success?.schedules ?? [];
          setEvents(dailyToEvents(list)); // snake 그대로 → Event[]로 맵핑
          console.log('[ScheduleUI] events:', events)
        } else {
          setEvents([]);
        }
      } catch (e) {
        console.error('일별 일정 조회 실패:', e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selectedDate]);

  const handleEventPress = (event: UIEvent) => {
    navigation.navigate('ViewScheduleDetailPage', {
      scheduleId: event.scheduleId,
    });
  };

  const handleTimeSlotPress = (time: number) => {
    Alert.alert('시간 선택', `${time}시를 선택했습니다.`);
    // 필요 시 새 일정 작성 페이지로 이동:
    // navigation.navigate('CreateSchedulePage', { selectedDate: dateISO, selectedTime: time });
  };

  if (loading) {
    return (
      <ScheduleUI
        date={dateISO}              // ✅ 패딩된 ISO 전달
        events={[]}                 // 로딩 중엔 빈 배열
        onEventPress={handleEventPress}
        onTimeSlotPress={handleTimeSlotPress}
        onBackPress={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScheduleUI
      date={dateISO}               // ✅ 패딩된 ISO 전달
      events={events}
      onEventPress={handleEventPress}
      onTimeSlotPress={handleTimeSlotPress}   // ✅ 중복 prop 제거
      onBackPress={() => navigation.goBack()}
    />
  );
};

export default SchedulePage;
