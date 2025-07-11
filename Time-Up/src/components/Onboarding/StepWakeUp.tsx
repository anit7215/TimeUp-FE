import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

export default function StepWakeUp() {
  return (
    <>
      <Text className="font-pretendard font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white mb-9">
        기상 시간을 입력해주세요
      </Text>
      {days.map((day) => (
        <TouchableOpacity
          key={day}
          className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-700"
          onPress={() => alert(`${day} 기상 시간 설정`)}
        >
          <Text className="text-white font-medium text-base">{day}</Text>
          <Text className="text-white font-normal text-base">|</Text>
          <Text className="text-white font-normal text-base">오전 08:00</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}
