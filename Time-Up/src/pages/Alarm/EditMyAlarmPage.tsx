// src/pages/EditMyAlarmPage.tsx
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import TransparentButton from '../../components/alarm/TransparentButton';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import BottomLayout from '../../Layouts/BottomLayout';

export default function EditMyAlarmPage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);

  const { height } = Dimensions.get('window');
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleSave = () => {
    console.log('내 알람을 저장합니다.');
  }

  const handleCancel = () => {
    console.log('내 알람을 취소합니다.');
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
        <View className="h-[55%] bg-gray-800 rounded-t-[30px] mt-[20%]">
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[8%]">
            <Text className="font-pretendard text-white text-xl">알람음</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
            <Text className="font-pretendard text-white text-xl">진동</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
            <Text className="font-pretendard text-white text-xl">다시 울림</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
            <Text className="font-pretendard text-white text-xl">메모</Text>
            <Text className='text-gray-300 text-xl'>입력 </Text>
          </View>

          <View className="flex-row items-center justify-center mx-4 gap-3"
            style={{ marginTop: Platform.OS === 'web' ? 150 : 100 }}>
            <TransparentButton title="취소" onPress={handleCancel} />
            <TransparentButton title="저장" onPress={handleSave} />
          </View>


        </View>
    </BottomLayout>
  );
}
