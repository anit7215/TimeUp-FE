// src/pages/TestTimeScrollPage.tsx
import React from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../Layouts/BottomLayout';
import HalfTimeScrollPanel from '../components/common/HalfTimeScrollPanel';
import PageBackButton from '../components/common/PageBackButton';

export default function AlarmPage() {
  return (
    <BottomLayout>
      <View className="h-[350px] items-center justify-center bg-white">
        <PageBackButton />
        <Text className="text-xl text-red-600 font-bold">오전오후 타임 스크롤 테스트 페이지</Text>
      </View>
      <View className="h-[60%] items-center justify-center bg-bgGray rounded-3xl">
        <HalfTimeScrollPanel />

      </View>
    </BottomLayout>
  );
}
