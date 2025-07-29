import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function StepTime() {
  return (
    <>
      <Text className="font-pretendard font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white mb-9">
        준비 및 이동 시간을 입력해주세요
      </Text>
      <TouchableOpacity className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-700" onPress={() => alert('외출 준비 시간 설정')}>
        <Text className="text-white font-medium text-base">외출 준비 시간</Text>
        <Text className="text-gray-100 font-normal text-base">선택</Text>
      </TouchableOpacity>
      <TouchableOpacity className="px-4 py-[6px] mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-700" onPress={() => alert('직장/학교까지 이동 시간')}>
        <View className="flex-col">
          <Text className="text-white font-medium text-base">직장/학교까지 이동 시간</Text>
          <Text className="text-gray-200 font-regular text-[10px]">*선택 사항</Text>
        </View>
        
        <Text className="text-gray-100 font-normal text-base">선택</Text>
      </TouchableOpacity>
    </>
  );
}
