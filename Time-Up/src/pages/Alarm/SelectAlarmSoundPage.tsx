// src/pages/SelectAlarmSoundPage.tsx
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';

export default function SelectAlarmSoundPage() {
  const navigation = useAppNavigation();

  const handleConfirm = () => {
    console.log('확인 버튼 클릭됨');
  };

  const [checked, setChecked] = React.useState(false);
  const handleCheckBoxChange = (val: boolean) => {
    setChecked(val);
    console.log(`체크박스 상태: ${val ? '선택됨' : '선택되지 않음'}`);
  }

  return (
    <BottomLayout>
        <View className="flex-row mt-3 items-center justify-between">
          <PageBackButton />
          <TransparentButton title="확인" onPress={handleConfirm} />
        </View>
        <Text className="text-xl text-white ml-9 mt-8">알람음</Text>

        <View className="flex-row ml-9 mt-6">
          <CheckBox isChecked={checked} onValueChangeHandler={handleCheckBoxChange} disabled={false}></CheckBox>
          <Text className="text-white text-xl ml-4">Heavy Raindrop</Text>
        </View>
        <View className="flex-row ml-9 mt-6">
          <CheckBox isChecked={checked} onValueChangeHandler={handleCheckBoxChange} disabled={false}></CheckBox>
          <Text className="text-white text-xl ml-4">Heavy Raindrop</Text>
        </View>
        <View className="flex-row ml-9 mt-6">
          <CheckBox isChecked={checked} onValueChangeHandler={handleCheckBoxChange} disabled={false}></CheckBox>
          <Text className="text-white text-xl ml-4">Heavy Raindrop</Text>
        </View>
        <View className="flex-row ml-9 mt-6">
          <CheckBox isChecked={checked} onValueChangeHandler={handleCheckBoxChange} disabled={false}></CheckBox>
          <Text className="text-white text-xl ml-4">Heavy Raindrop</Text>
        </View>
        <View className="flex-row ml-9 mt-6">
          <CheckBox isChecked={checked} onValueChangeHandler={handleCheckBoxChange} disabled={false}></CheckBox>
          <Text className="text-white text-xl ml-4">Heavy Raindrop</Text>
        </View>        

    </BottomLayout>
  );
}
