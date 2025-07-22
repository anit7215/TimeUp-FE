import React, { useState } from 'react';
import { Alert } from 'react-native';
import ScheduleUI from '../components/SetSchedule/ScheduleUI';

const SchedulePage = () => {
  const [events, setEvents] = useState([
    { 
      id: '1', 
      title: '대학 탐방 회의', 
      startTime: 9, 
      duration: 1, 
      color: '#FFB366' 
    },
    { 
      id: '2', 
      title: '머리 2차 과제', 
      startTime: 15, 
      duration: 1, 
      color: '#90EE90' // 목데이터
    },
  ]);

  const handleEventPress = (event: any) => {
    Alert.alert('이벤트 선택', `${event.title}을(를) 선택했습니다.`);
  };

  const handleTimeSlotPress = (time: number) => {
    Alert.alert('시간 선택', `${time}시를 선택했습니다.`);
  };

  const handleBackPress = () => {
    // 네비게이션 뒤로가기 로직
    console.log('뒤로가기');
  };

  return (
    <ScheduleUI
      date="5월 21일 일요일"
      events={events}
      onEventPress={handleEventPress}
      onTimeSlotPress={handleTimeSlotPress}
      onBackPress={handleBackPress}
    />
  );
};

export default SchedulePage;