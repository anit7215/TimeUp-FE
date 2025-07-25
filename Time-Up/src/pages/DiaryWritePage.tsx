// src/pages/DiaryWritePage.tsx
import React from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../Layouts/BottomLayout';
import useAppNavigation from '../hooks/useAppNavigation';

export default function DiaryWritePage() {
  const navigation = useAppNavigation();
  return (
    <BottomLayout>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl text-red-600 font-bold">일기쓰기페이지</Text>
      </View>
    </BottomLayout>
  );
}
