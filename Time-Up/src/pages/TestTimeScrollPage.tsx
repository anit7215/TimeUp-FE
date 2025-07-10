// src/pages/TestTimeScrollPage.tsx
import React from 'react';
import { Text, View } from 'react-native';
import PageBackButton from '../components/common/PageBackButton';
import TimeScrollPanel from '../components/common/TimeScrollPanel';
import BottomLayout from '../Layouts/BottomLayout';

export default function AlarmPage() {
  return (
    <BottomLayout>
      <View className="h-[350px] items-center justify-center bg-white">
        <PageBackButton />
        <Text className="text-xl text-red-600 font-bold">24시간 스크롤 테스트 페이지</Text>
      </View>
      <View className="h-[60%] items-center justify-center bg-gray700 rounded-3xl">
        <TimeScrollPanel />
      </View>
    </BottomLayout>
  );
}
