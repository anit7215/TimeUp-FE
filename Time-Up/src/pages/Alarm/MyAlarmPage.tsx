// src/pages/MyAlarmPage.tsx
// 자동알람 - 기상알람 페이지
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import ToggleSwitch from '../../components/common/ToggleSwitch';

export default function MyAlarmPage() {
  const navigation = useNavigation();
  const [on, setOn] = useState(false);
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])
  
  return (
    <BottomLayout>
        <View className="h-[19%] bg-blue justify-center rounded-t rounded-[20%]">
          <Text className="font-pretendard text-white text-3xl ml-5 mb-4">자동 알람</Text>
        </View>
        <View className="h-14 w-[91%] bg-light rounded-2xl self-center items-center flex-row -m-7">
          <Text className="font-pretendard text-black ml-[4%] mr-[27%] text-xl">6월 28일 (일) ㅣ 오전 07 : 30</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="flex-row items-start mt-[33%]">
          <Text className='font-pretendard text-gray-300 text-[24px] ml-[4%]'>기상 알람</Text>
          <Text className='font-pretendard text-white text-[24px] ml-[4%]'>내 알람</Text>
        </View>
        <View className="flex-row items-start mt-2">
          <View className="h-[2px] w-[21%] bg-black ml-[4%]"/>
          <View className="h-[2px] w-[15%] bg-white ml-[4%]"/>
        </View>
        <View className="ml-[85%] mt-[-40px]">
          <TouchableOpacity onPress={() => console.log('Add pressed')}>
            <Ionicons name="add-circle-outline" size={38} color="white" />
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          <View className="w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4"
            style={{ height: Platform.OS === 'web' ? 75 : 63 }}
          >
            <Text className="font-pretendard text-white ml-[4%] text-[18px]">딥러닝 과제 제출</Text>
            <Text className="font-pretendard text-white ml-[3%] text-xl">ㅣ</Text>
            <View className="ml-[3%] flex-col">
              <Text className="font-pretendard text-white text-base">6월 27일 (토)</Text>
              <Text className="font-pretendard text-white text-base">오후  10 : 00</Text>
            </View>
            <View style={{ marginLeft: Platform.OS === 'web' ? 95 : 68 }}>
              <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
            </View>
          </View>
                    <View className="w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4"
            style={{ height: Platform.OS === 'web' ? 75 : 63 }}
          >
            <Text className="font-pretendard text-white ml-[4%] text-[18px]">딥러닝 과제 제출</Text>
            <Text className="font-pretendard text-white ml-[3%] text-xl">ㅣ</Text>
            <View className="ml-[3%] flex-col">
              <Text className="font-pretendard text-white text-base">6월 27일 (토)</Text>
              <Text className="font-pretendard text-white text-base">오후  10 : 00</Text>
            </View>
            <View style={{ marginLeft: Platform.OS === 'web' ? 95 : 68 }}>
              <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
            </View>
          </View>
          <View className="w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4"
            style={{ height: Platform.OS === 'web' ? 75 : 63 }}
          >
            <Text className="font-pretendard text-white ml-[4%] text-[18px]">딥러닝 과제 제출</Text>
            <Text className="font-pretendard text-white ml-[3%] text-xl">ㅣ</Text>
            <View className="ml-[3%] flex-col">
              <Text className="font-pretendard text-white text-base">6월 27일 (토)</Text>
              <Text className="font-pretendard text-white text-base">오후  10 : 00</Text>
            </View>
            <View style={{ marginLeft: Platform.OS === 'web' ? 95 : 68 }}>
              <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
            </View>
          </View>
          <View className="w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4"
            style={{ height: Platform.OS === 'web' ? 75 : 63 }}
          >
            <Text className="font-pretendard text-white ml-[4%] text-[18px]">딥러닝 과제 제출</Text>
            <Text className="font-pretendard text-white ml-[3%] text-xl">ㅣ</Text>
            <View className="ml-[3%] flex-col">
              <Text className="font-pretendard text-white text-base">6월 27일 (토)</Text>
              <Text className="font-pretendard text-white text-base">오후  10 : 00</Text>
            </View>
            <View style={{ marginLeft: Platform.OS === 'web' ? 95 : 68 }}>
              <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
            </View>
          </View>
          <View className="w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4"
            style={{ height: Platform.OS === 'web' ? 75 : 63 }}
          >
            <Text className="font-pretendard text-white ml-[4%] text-[18px]">딥러닝 과제 제출</Text>
            <Text className="font-pretendard text-white ml-[3%] text-xl">ㅣ</Text>
            <View className="ml-[3%] flex-col">
              <Text className="font-pretendard text-white text-base">6월 27일 (토)</Text>
              <Text className="font-pretendard text-white text-base">오후  10 : 00</Text>
            </View>
            <View style={{ marginLeft: Platform.OS === 'web' ? 95 : 68 }}>
              <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
            </View>
          </View>
          <View className="w-[91%] bg-gray-700 rounded-2xl self-center items-center flex-row mt-4"
            style={{ height: Platform.OS === 'web' ? 75 : 63 }}
          >
            <Text className="font-pretendard text-white ml-[4%] text-[18px]">딥러닝 과제 제출</Text>
            <Text className="font-pretendard text-white ml-[3%] text-xl">ㅣ</Text>
            <View className="ml-[3%] flex-col">
              <Text className="font-pretendard text-white text-base">6월 27일 (토)</Text>
              <Text className="font-pretendard text-white text-base">오후  10 : 00</Text>
            </View>
            <View style={{ marginLeft: Platform.OS === 'web' ? 95 : 68 }}>
              <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
            </View>
          </View>

        </View>
    </BottomLayout>
  );
}
