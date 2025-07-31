// src/pages/WakeUpAlarmPage.tsx
// 자동알람 - 기상알람 페이지
import { formatTime } from '@/src/utils/AlarmFormat';
import { createDefaultWakeupAlarm } from '@/src/utils/alarmDefaults';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import { Day, useAlarmContext } from '../../contexts/AlarmContext';
import useAppNavigation from '../../hooks/useAppNavigation';

const weekdays: Day[] = ['월', '화', '수', '목', '금', '토', '일'];

export default function WakeUpAlarmPage() {
  const navigation = useAppNavigation();
  const { setSelectedDay, weekdaySwitchStates, setWeekdaySwitchStates, autoAlarmOn, setAutoAlarmOn, myAlarms, setMyAlarms, setSelectedAlarmId, } = useAlarmContext();

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
    const alarmExists = myAlarms.find((alarm) => alarm.date.dayOfWeek === day);

    if (!alarmExists) {
      const defaultAlarm = createDefaultWakeupAlarm(day);
      setMyAlarms((prev) => [...prev, defaultAlarm]);
      setSelectedAlarmId(defaultAlarm.id);
    } else {
      setSelectedAlarmId(alarmExists.id);
    }

    setSelectedDay(day);
    console.log(`${day} 기상알람 디테일 페이지로 이동합니다.`);
    navigation.navigate('WakeUpAlarmDetailPage');
  };

  return (
    <BottomLayout>
      <View className="flex-row items-center justify-between mr-[4%] mt-[6%]">
        <Text className="font-pretendard text-white text-3xl ml-5 mb-4">내일의 자동 알람</Text>
        <ToggleSwitch isOn={autoAlarmOn} onToggle={handleToggleAutoAlarm} disabled={false} />
      </View>

      <LinearGradient
        colors={['#F7F7FE', '#4D4DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 57, padding: 1 }}
      >
        <View className="h-[8.5rem] w-full bg-dark rounded-full self-center flex-row items-center justify-between px-[4%]">
          <View className="flex-1 items-center justify-center">
            <Text className="font-pretendard text-white text-xl">6월 28일 (일)</Text>
            <Text className="font-pretendard text-white text-4xl mt-1">오전 07 : 30</Text>
          </View>
        </View>
      </LinearGradient>

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
        {weekdays.map((day) => {
          const alarm = myAlarms.find((a) => a.date.dayOfWeek === day);
          const formattedTime = alarm ? formatTime(alarm.time) : '오전 08 : 00';

          return (
            <TouchableOpacity
              key={day}
              onPress={() => handleDetailPage(day)}
              activeOpacity={0.7}
            >
              <View className="h-14 w-[91%] bg-dark border border-dark-stroke rounded-full self-center flex-row items-center justify-between px-[5%] mt-4">
                <View className="flex-row items-center gap-x-2 flex-nowrap overflow-hidden">
                  <Text className="font-pretendard text-white text-xl">{day}요일</Text>
                  <Text className="font-pretendard text-white text-xl">   ㅣ   </Text>
                  <Text className="font-pretendard text-white text-xl">{formattedTime}</Text>
                </View>
                <ToggleSwitch
                  isOn={weekdaySwitchStates[day]}
                  onToggle={() => handleToggleSwitchForDay(day)}
                  disabled={false}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomLayout>
  );
}