// src/pages/MyAlarmPage.tsx
// 자동알람 - 기상알람 페이지
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function MyAlarmPage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'wakeup' | 'my'>('wakeup');
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleWakeUpPage = () => {
    console.log('기상 알람 페이지로 이동합니다.');
    navigation.navigate('WakeUpAlarmPage');
  };
  
  return (
    <BottomLayout>
        <View className="h-[19%] bg-blue justify-center rounded-t rounded-[20%]">
          <Text className="font-pretendard text-white text-3xl ml-5 mb-4">자동 알람</Text>
        </View>

      <View className="h-[4.5rem] w-[91%] bg-light rounded-3xl self-center flex-row -m-7 items-center justify-between px-[4%] border border-light-stroke">
        <View className="flex-row items-center space-x-2">
          <Text className="font-pretendard text-black text-xl">6월 28일 (일)</Text>
          <Text className="font-pretendard text-black text-xl">  ㅣ  </Text>
          <Text className="font-pretendard text-black text-xl">오전 07 : 30</Text>
        </View>
        <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
      </View>

      <View className="flex-row items-start mt-[20%] ml-[4%]">
        <Text className="font-pretendard text-[24px] mr-4 text-gray-300" onPress={handleWakeUpPage}>
          기상 알람
        </Text>
        <Text className="font-pretendard text-[24px] text-white font-semibold">
          내 알람
        </Text>
      </View>
      <View className="flex-row items-start mt-2">
        <View className="h-[2px] w-[21%] bg-black ml-[4%]" />
        <View className="h-[2px] w-[15%] bg-white" style={{ marginLeft: Platform.OS === 'web' ? 11 : 14 }}/>
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
