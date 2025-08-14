import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PlusIcon from '../../../assets/icons/plusIcon.svg';
import PageBackButton from '../common/PageBackButton';
import { formatKoreanDate } from './formatDate';
import { Dispatch } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSchedule } from '@/src/context/ScheduleContext';


const GRID_START = 6;        // 6시 시작
const ROW_HEIGHT = 90;       // 1시간(60+30) = 90px
const TIMELINE_PADDING_TOP = 0;  // 타임라인 위쪽 여백을 주고 싶으면 스타일에서 paddingTop으로만 제어


export interface UIEvent {
  id: string;
  title: string;
  startTime: number; // 시간 (7, 8, 9, etc.)
  duration: number; // 지속 시간 (1 = 1시간)
  color: string;
  scheduleId: string; // 백엔드 스케줄 ID 추가
}

interface ScheduleUIProps {
  date?: string;
  events?: UIEvent[];
  onEventPress?: (event: UIEvent) => void;
  onTimeSlotPress?: (time: number) => void;
  onBackPress?: () => void;
}

const ScheduleUI: React.FC<ScheduleUIProps> = ({
  date,
  events = [],
  onEventPress,
  onTimeSlotPress
}) => {
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6시부터 23시까지
  const SLOT_HEIGHT = 60;
  const FULL_SLOT_HEIGHT = SLOT_HEIGHT + 30; // 30분 단위로 나누기 위해 2배 높이 설정

  const getEventStyle = (event: UIEvent) => {
    // const startIndex = event.startTime - 6;
    // const top = startIndex * FULL_SLOT_HEIGHT + 30;
    // const height = event.duration * FULL_SLOT_HEIGHT - 2;
      
    const top = (event.startTime - GRID_START) * ROW_HEIGHT + TIMELINE_PADDING_TOP;
    const height = event.duration * ROW_HEIGHT;

    return {
      position: 'absolute' as const,
      top,
      left: 50,
      right: 16,
      height,
      backgroundColor: event.color,
      borderRadius: 8,
      padding: 8,
      justifyContent: 'center' as const,
      zIndex: 1,
    };
  };

  const renderTimeSlot = (hour: number, index: number) => { // 시간 슬롯 렌더링
    return (
      <View key={hour}>
        <TouchableOpacity
          style={styles.timeSlot}
          onPress={() => onTimeSlotPress?.(hour)}
          activeOpacity={0.7}
        >
          <Text style={styles.timeText}>{hour}</Text>
          <View style={styles.slotLine} />
        </TouchableOpacity>
        <View style={styles.halfSlot}>
          <View style={styles.slotLine30} />
        </View>
      </View>
    );
  };

  const renderEvent = (event: UIEvent) => { // 이벤트 렌더링
    return (
      <TouchableOpacity
        key={event.id}
        style={getEventStyle(event)}
        onPress={() => onEventPress?.(event)}
        activeOpacity={0.8}
      >
        <Text style={styles.eventTitle}>{event.title}</Text>
      </TouchableOpacity>
    );
  };

  
    const navigation = useNavigation<any>();
    const { dispatch } = useSchedule();
    const selectedDate = date;

  const handleAddSchedule = () => {
    const dateToUse = selectedDate;
    console.log('선택된 날짜:', dateToUse);

    dispatch({ type: 'RESET_DRAFT'});
    dispatch({ type: 'UPDATE_DRAFT', payload: { start_date: dateToUse, end_date: dateToUse}})
    navigation.navigate('AddSchedulePage');
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A2A2A" />
      
      {/* Header */}
      <View style={styles.header}>
        <PageBackButton/>
        <Text style={styles.headerTitle}>{formatKoreanDate(date)}</Text>
        <TouchableOpacity onPress={handleAddSchedule}>
          <PlusIcon />
        </TouchableOpacity>
      </View>

      {/* Schedule Content */}
      <ScrollView 
        style={styles.scheduleContainer}
        showsVerticalScrollIndicator={false} // 스크롤바 안 보이게
        contentContainerStyle={styles.scheduleContent}
      >
        <View style={styles.timelineContainer}>
          {/* Time Slots */}
          {hours.map(renderTimeSlot)}
          
          {/* Events */}
          {events.map(renderEvent)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 가로 방향 가운데 정렬
    alignItems: 'center',     // 세로 방향 가운데 정렬
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#121212',
    position: 'relative',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'center',
  },
  addButton: {
    padding: 8,
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#1C1F21',
  },
  scheduleContent: {
    paddingBottom: 100, // 하단 여백
  },
  timelineContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  halfSlot: {
    height: 30,
    justifyContent: 'center',
    backgroundColor : '#1C1F21', // 배경색과 동일하게 설정
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    position: 'relative',
  },
  timeText: {
    color: '#F7F7FE',
    fontSize: 16,
    fontWeight: '300',
    width: 30,  
    textAlign: 'center',
  },
  slotLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#65695D',
    marginLeft: 12,
  },
  slotLine30: {
    height: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#CDCDD1',
    marginLeft: 12,
  },
  eventTitle: {
    color: '#33373B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default ScheduleUI;