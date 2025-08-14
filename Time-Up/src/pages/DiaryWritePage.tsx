import React from 'react';
import { Text, View } from 'react-native';
import DiaryIcon from '../../assets/images/DiaryIcon.svg';
import useAppNavigation from '../hooks/useAppNavigation';
import BottomLayout from '../Layouts/BottomLayout';

export default function DiaryWritePage() {
  const navigation = useAppNavigation();
  return (
    <BottomLayout>
      <View className="flex-1 items-center justify-center bg-black">
        <DiaryIcon/>
        <Text className="mt-[54px] text-xl text-slate-50 text-white font-medium leading-7">하루 일기 서비스를 준비중입니다!</Text>
        <Text className="text-xl text-slate-50 text-white font-medium leading-7">곧 만나요!</Text>
      </View>
    </BottomLayout>
  );
}
