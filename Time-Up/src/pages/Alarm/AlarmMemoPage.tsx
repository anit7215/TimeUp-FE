// src/pages/AlarmMemoPage.tsx
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useCallback, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import TransparentButton from '../../components/alarm/TransparentButton';
import HalfTimeScrollPanel from '../../components/common/HalfTimeScrollPanel';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import BottomLayout from '../../Layouts/BottomLayout';

export default function AlarmMemoPage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleSave = () => {
    console.log('기상 알람 설정이 저장되었습니다')
  }

  const handleCannel = () => {
    console.log('기상 알람 설정이 취소되었습니다')
  }
  
  return (
    <BottomLayout>
      <View className="flex-row items-center mt-[15%]" >
        <Text className='font-pretendard text-white text-[24px] ml-[4%] mr-[45%]'>월요일 기상 알람</Text>
        <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
      </View>
      <View className="bg-black items-center justify-center"
        style={{ marginTop: Platform.OS === 'web' ? 55 : 15 }}
      >
        <HalfTimeScrollPanel />
      </View>
      <View className="h-[55%] bg-gray-700 rounded-t-[30px]"
        style={{ marginTop: Platform.OS === 'web' ? 65 : 30 }}
      >
        <View className="h-[65%] w-[90%] border border-gray-500 rounded-2xl self-center mt-[5%]" >
          <Text className='text-gray-500 text-xl ml-[6%] mt-[7%]'>내용 입력</Text>
        </View>

        <View className="flex-row items-center justify-center mt-[6%] mx-4 gap-3">
          <TransparentButton title="취소" onPress={handleCannel} />
          <TransparentButton title="저장" onPress={handleSave} />
        </View>


      </View>
    </BottomLayout>
  );
}
