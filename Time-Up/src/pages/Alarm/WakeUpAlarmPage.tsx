// src/pages/WakeUpAlarmPage.tsx
// 자동알람 - 기상알람 페이지
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import { Day, useAlarmContext } from '../../contexts/AlarmContext';
import useAppNavigation from '../../hooks/useAppNavigation';

const weekdays: Day[] = ['월', '화', '수', '목', '금', '토', '일'];

export default function WakeUpAlarmPage() {
  const navigation = useAppNavigation();
  const { setSelectedDay, weekdaySwitchStates, setWeekdaySwitchStates, autoAlarmOn, setAutoAlarmOn, } = useAlarmContext();

  const handleToggleAutoAlarm = () => {
    if (!autoAlarmOn) {
      console.log('자동알람이 켜졌습니다.');
    } else {
      console.log('자동알람이 꺼졌습니다.');
    }
    setAutoAlarmOn((prev) => !prev);
  };

  const handleToggleSwitchForDay = (day: Day) => {
    setWeekdaySwitchStates(prev => {
      const next = { ...prev, [day]: !prev[day] };
      console.log(`${day} 기상알람이 ${next[day] ? '켜졌습니다' : '꺼졌습니다'}.`);
      return next;
    });
  };

  const handleMyPage = () => {
    console.log('내 알람 페이지로 이동합니다.');
    navigation.navigate('MyAlarmPage');
  };

  const handleDetailPage = (day: Day) => {
    setSelectedDay(day);
    console.log(`${day} 기상알람 디테일 페이지로 이동합니다.`);
    navigation.navigate('WakeUpAlarmDetailPage');
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
        <ToggleSwitch
          isOn={autoAlarmOn}
          onToggle={handleToggleAutoAlarm}
          disabled={false}
        />
      </View>

      <View className="flex-row items-start mt-[20%] ml-[4%]">
        <Text className="font-pretendard text-[24px] mr-4 text-white font-semibold">
          기상 알람
        </Text>
        <Text className="font-pretendard text-[24px] text-gray-300" onPress={handleMyPage}>
          내 알람
        </Text>
      </View>
      <View className="flex-row items-start mt-2">
        <View className="h-[2px] w-[21%] bg-white ml-[4%]" />
        <View className="h-[2px] w-[15%] bg-black ml-[4%]" />
      </View>

      <View className="mt-3">
        {weekdays.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDetailPage(day)}
            activeOpacity={0.7}
          >
            <View className="h-14 w-[91%] bg-dark border border-dark-stroke rounded-full self-center flex-row items-center justify-between px-[5%] mt-4">
              <View className="flex-row items-center gap-x-2 flex-nowrap overflow-hidden">
                <Text className="font-pretendard text-white text-xl">{day}요일</Text>
                <Text className="font-pretendard text-white text-xl">   ㅣ   </Text>
                <Text className="font-pretendard text-white text-xl">오전 08 : 00</Text>
              </View>
              <ToggleSwitch
                isOn={weekdaySwitchStates[day]}
                onToggle={() => handleToggleSwitchForDay(day)}
                disabled={false}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BottomLayout>
  );
}