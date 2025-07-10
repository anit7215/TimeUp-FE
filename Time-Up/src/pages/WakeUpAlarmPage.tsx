// src/pages/AlarmPage.tsx
// 자동알람 - 기상알람 페이지
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomLayout from '../Layouts/BottomLayout';
import ToggleSwitch from '../components/common/ToggleSwitch';

export default function AlarmPage() {
  const navigation = useNavigation();
  const [on, setOn] = useState(false);
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])
  
  return (
    <BottomLayout>
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-black">
        <View className="h-[19%] bg-blue justify-center rounded-t rounded-[20%]">
          <Text className="font-pretendard text-white text-3xl ml-5 mb-4">자동 알람</Text>
        </View>
        <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row -m-7">
          <Text className="font-pretendard text-white ml-[4%] mr-[27%] text-xl">6월 28일 (일) ㅣ 오전 07 : 30</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="flex-row items-start mt-[33%]">
          <Text className='font-pretendard text-white text-[24px] ml-[4%]'>기상 알람</Text>
          <Text className='font-pretendard text-gray-300 text-[24px] ml-[4%]'>내 알람</Text>
        </View>
        <View className="flex-row items-start mt-2">
          <View className="h-[2px] w-[21%] bg-white ml-[4%]"/>
          <View className="h-[2px] w-[15%] bg-black ml-[4%]"/>
        </View>
        <View className="mt-3">
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">월요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">화요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">수요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">목요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">금요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">토요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
          <View className="h-14 w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4">
            <Text className="font-pretendard text-white ml-[4%] text-xl">일요일</Text>
            <Text className="font-pretendard text-white ml-6 text-xl">ㅣ</Text>
            <Text className="font-pretendard text-white ml-6 mr-[29%] text-xl">오전  08 : 00</Text>
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
          </View>
        </View>
      </SafeAreaView>
    </BottomLayout>
  );
}
