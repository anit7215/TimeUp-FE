// src/pages/SelectAlarmDatePage.tsx
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import TransparentButton from '../../components/alarm/TransparentButton';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';
import BottomLayout from '../../Layouts/BottomLayout';

export default function SelectAlarmDatePage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);

  const { height } = Dimensions.get('window');
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleSelect = () => {
    console.log('날짜를 선택합니다.');
  }

  const handleCancel = () => {
    console.log('날짜 선택을 취소합니다.');
  }

  
  
  return (
    <BottomLayout>
        <View className="flex-row items-center justify-between mr-[4%]" 
          style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
          <Text className='font-pretendard text-white text-[24px] ml-[4%]'>알람 이름</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="bg-black items-center justify-center mt-[15%]">
          <View className="w-[80%] items-center justify-center"
            style={{ height: Platform.OS === 'web' ? height * 0.20 : height * 0.22 }}>
            <Text className="font-pretendard text-white text-3xl mb-4">5월 21일 (수)</Text>
            <Text className="font-pretendard text-white text-[40px]">오전    12  :  00</Text>
          </View>
        </View>
        <View className="h-[55%] bg-gray-700 rounded-t-[30px] mt-[20%]">
          <View className="h-[60%] w-[80%] bg-gray-300 self-center items-center justify-center mt-[15%]">
            <Text className="font-pretendard text-black text-xl">캘린더</Text>
          </View>

          <View className="flex-row items-center justify-center mx-4 gap-3"
            style={{ marginTop: Platform.OS === 'web' ? 60 : 20 }}>
            <TransparentButton title="취소" onPress={handleCancel} />
            <TransparentButton title="선택" onPress={handleSelect} />
          </View>


        </View>
    </BottomLayout>
  );
}
