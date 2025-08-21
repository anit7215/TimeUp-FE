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
import { useNavigation } from '@react-navigation/native';
import { useSchedule } from '@/src/context/ScheduleContext';

const GRID_START = 0;        // 0시 시작
const ROW_HEIGHT = 90;       // 1시간 = 90px
const TIMELINE_PADDING_TOP = 0;

export interface UIEvent {
  id: string;
  title: string;
  startTime: number; // 시간 (7.5 = 7시 30분)
  duration: number; // 지속 시간 (0.5 = 30분, 1 = 1시간)
  color: string;
  scheduleId: string;
  url?: string;
}

interface ScheduleUIProps {
  date?: string;
  events?: UIEvent[];
  onEventPress?: (event: UIEvent) => void;
  onTimeSlotPress?: (time: number) => void;
  onBackPress?: () => void;
}

// 겹치는 이벤트들을 그룹화하고 위치를 계산하는 함수
const calculateEventLayout = (events: UIEvent[]) => {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.startTime !== b.startTime) return a.startTime - b.startTime;
    return a.duration - b.duration;
  });

  const eventGroups: UIEvent[][] = [];
  
  sortedEvents.forEach(event => {
    // 현재 이벤트와 겹치는 그룹 찾기
    let foundGroup = false;
    
    for (let group of eventGroups) {
      const hasOverlap = group.some(groupEvent => {
        const eventEnd = event.startTime + event.duration;
        const groupEventEnd = groupEvent.startTime + groupEvent.duration;
        
        return !(eventEnd <= groupEvent.startTime || event.startTime >= groupEventEnd);
      });
      
      if (hasOverlap) {
        group.push(event);
        foundGroup = true;
        break;
      }
    }
    
    if (!foundGroup) {
      eventGroups.push([event]);
    }
  });

  // 각 그룹 내에서 이벤트들의 위치 계산
  const eventLayouts = new Map();
  
  eventGroups.forEach(group => {
    const columns: UIEvent[][] = [];
    
    group.forEach(event => {
      let columnIndex = 0;
      
      // 배치 가능한 컬럼 찾기
      while (columnIndex < columns.length) {
        const column = columns[columnIndex];
        const hasConflict = column.some(colEvent => {
          const eventEnd = event.startTime + event.duration;
          const colEventEnd = colEvent.startTime + colEvent.duration;
          
          return !(eventEnd <= colEvent.startTime || event.startTime >= colEventEnd);
        });
        
        if (!hasConflict) {
          column.push(event);
          break;
        }
        columnIndex++;
      }
      
      // 새 컬럼 생성
      if (columnIndex === columns.length) {
        columns.push([event]);
      }
      
      eventLayouts.set(event.id, {
        columnIndex,
        totalColumns: 0, // 나중에 설정
      });
    });
    
    // 총 컬럼 수 설정
    group.forEach(event => {
      const layout = eventLayouts.get(event.id);
      layout.totalColumns = columns.length;
    });
  });
  
  return eventLayouts;
};

const ScheduleUI: React.FC<ScheduleUIProps> = ({
  date,
  events = [],
  onEventPress,
  onTimeSlotPress
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 이벤트 레이아웃 계산
  const eventLayouts = calculateEventLayout(events);

  const getEventStyle = (event: UIEvent) => {
    const layout = eventLayouts.get(event.id);
    const { columnIndex, totalColumns } = layout || { columnIndex: 0, totalColumns: 1 };
    
    // 분 단위 계산
    const pixelsPerHour = ROW_HEIGHT;
    const top = (event.startTime - GRID_START) * pixelsPerHour + TIMELINE_PADDING_TOP;
    const height = event.duration * pixelsPerHour;
    
    // 겹치는 이벤트들의 너비와 위치 계산
    const eventWidth = totalColumns > 1 ? `${95 / totalColumns}%` : '95%';
    const leftOffset = totalColumns > 1 ? `${(95 / totalColumns) * columnIndex}%` : '0%';

    return {
      position: 'absolute' as const,
      top: top + 32,
      left: `${((50 - 16) / (375 - 32)) * 100 + 2}%`, // 기본 left 위치에서 약간 조정
      width: eventWidth,
      marginLeft: leftOffset,
      height: Math.max(height - 2, 20), // 최소 높이 20px
      backgroundColor: event.color,
      borderRadius: 6,
      padding: totalColumns > 2 ? 4 : 8,
      justifyContent: 'center' as const,
      zIndex: 1,
      borderWidth: 0.5,
      borderColor: 'rgba(255,255,255,0.1)',
    };
  };

  const renderTimeSlot = (hour: number) => {
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

  const renderEvent = (event: UIEvent) => {
    const layout = eventLayouts.get(event.id);
    const { totalColumns } = layout || { totalColumns: 1 };
    
    // 제목을 컬럼 수에 따라 조정
    const truncateTitle = (title: string, maxLength: number) => {
      return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };
    
    const maxTitleLength = totalColumns > 2 ? 8 : totalColumns > 1 ? 12 : 20;
    const fontSize = totalColumns > 2 ? 12 : totalColumns > 1 ? 14 : 16;
    
    return (
      <TouchableOpacity
        key={event.id}
        style={getEventStyle(event)}
        onPress={() => onEventPress?.(event)}
        activeOpacity={0.8}
      >
        <Text 
          style={[
            styles.eventTitle, 
            { fontSize, lineHeight: fontSize + 2 }
          ]}
          numberOfLines={totalColumns > 2 ? 2 : 3}
          ellipsizeMode="tail"
        >
          {truncateTitle(event.title, maxTitleLength)}
        </Text>
        {event.duration < 1 && totalColumns <= 2 && (
          <Text style={[styles.eventTime, { fontSize: fontSize - 2 }]}>
            {formatTime(event.startTime)} - {formatTime(event.startTime + event.duration)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // 시간을 형식화하는 헬퍼 함수
  const formatTime = (time: number) => {
    const hour = Math.floor(time);
    const minute = Math.floor((time - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
        showsVerticalScrollIndicator={false}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
    left: 50,
    right: 50,
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
    paddingBottom: 100,
  },
  timelineContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingTop: 0,
  },
  halfSlot: {
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#1C1F21',
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
    fontWeight: '600',
    textAlign: 'left',
  },
  eventTime: {
    color: '#55595B',
    fontWeight: '400',
    textAlign: 'left',
    marginTop: 2,
  },
});

export default ScheduleUI;