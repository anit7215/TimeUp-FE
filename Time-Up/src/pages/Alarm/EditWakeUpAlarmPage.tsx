// src/pages/EditWakeUpAlarmPage.tsx
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useCallback, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import TransparentButton from '../../components/alarm/TransparentButton';
import HalfTimeScrollPanel from '../../components/common/HalfTimeScrollPanel';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import BottomLayout from '../../Layouts/BottomLayout';

export default function EditWakeUpAlarmPage() {
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
        <View className="flex-row items-center justify-between mr-[4%]" 
          style={{ marginTop: Platform.OS === 'web' ? 30 : 30 }}>
          <Text className='font-pretendard text-white text-[24px] ml-[4%] mr-[45%]'>월요일 기상 알람</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="bg-black items-center justify-center"
          style={{ marginTop : Platform.OS === 'web' ? 55 : 30 }}
        >
          <HalfTimeScrollPanel />
        </View>
        <View className="h-[55%] bg-gray-800 rounded-t-[30px]"
          style={{ marginTop : Platform.OS === 'web' ? 65 : 35 }}
        >
          <Text className='text-white text-xl ml-[6%] mt-[7%]'>반복요일</Text>
          <View className="flex-row items-center justify-center mt-[4%] mx-4">
            <Text className='text-white text-xl'>   월   </Text>
            <Text className='text-white text-xl'>   화   </Text>
            <Text className='text-white text-xl'>   수   </Text>
            <Text className='text-white text-xl'>   목   </Text>
            <Text className='text-white text-xl'>   금   </Text>
            <Text className='text-white text-xl'>   토   </Text>
            <Text className='text-white text-xl'>   일   </Text>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[4%]"/>
          <View className="h-[8%] w-[91%] self-center items-center flex-row mt-[2%]">
            <Text className="font-pretendard text-white ml-[5%] mr-[66%] text-xl">알람음</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[91%] self-center items-center flex-row mt-[2%]">
            <Text className="font-pretendard text-white ml-[5%] mr-[66%] text-xl">진동   </Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[91%] self-center items-center flex-row mt-[2%]">
            <Text className="font-pretendard text-white ml-[5%] mr-[60%] text-xl">다시 울림</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[91%] self-center items-center flex-row mt-[2%]">
            <Text className="font-pretendard text-white ml-[5%] mr-[66%] text-xl">메모   </Text>
            <Text className='text-gray-300 text-xl'> 입력</Text>
          </View>
          <View className="flex-row items-center justify-center mx-4 gap-3"
            style={{ marginTop: Platform.OS === 'web' ? 40 : 35 }}>
            <TransparentButton title="취소" onPress={handleCannel} />
            <TransparentButton title="저장" onPress={handleSave} />
          </View>


        </View>
    </BottomLayout>
  );
}
