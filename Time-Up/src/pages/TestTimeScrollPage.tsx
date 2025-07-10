// src/pages/TestTimeScrollPage.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PageBackButton from '../components/common/PageBackButton';
import TimeScrollPanel from '../components/TimeScrollPanel';
import BottomLayout from '../Layouts/BottomLayout';

export default function AlarmPage() {
  return (
    <BottomLayout>
      <View className="h-[350px] items-center justify-center bg-white">
        <PageBackButton />
        <Text className="text-xl text-red-600 font-bold">24시간 스크롤 테스트 페이지</Text>
      </View>
      <View className="h-[500px] items-center justify-center bg-gray-200 rounded-3xl">
        <TimeScrollPanel />

        <View className="flex-row mt-20 space-x-6 gap-20">
          <TouchableOpacity className="bg-gray-500 px-8 py-4 rounded-lg">
            <Text className="text-2xl text-white font-semibold">취소</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-purple-600 px-8 py-4 rounded">
            <Text className="text-2xl text-white font-semibold">변경</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomLayout>
  );
}
