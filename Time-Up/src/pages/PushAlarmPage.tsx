// src/pages/PushAlarmPage.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PushAlarmPage() {
  const handleOff = () => {
    console.log('알람 해제 버튼 클릭됨');
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-black items-center justify-center"
    >
      <Text className="font-pretendard text-white text-[48px] mb-4">오전   12  :  00</Text>
      <Text className="font-pretendard text-white text-2xl mb-7">5월 21일 (수)</Text>
      <Text className="font-pretendard text-white text-[24px] mb-[20%]">딥러닝 과제 제출</Text>

      <TouchableOpacity onPress={handleOff} className="w-[70%] border border-white px-6 py-3 rounded-full items-center justify-center" activeOpacity={0.7}>
        <Text className="text-white text-2xl font-pretendard">알람 해제</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
