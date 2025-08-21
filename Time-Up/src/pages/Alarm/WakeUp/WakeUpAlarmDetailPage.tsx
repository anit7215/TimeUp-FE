// src/pages/WakeUpAlarmDetailPage.tsx
import AlarmButton from '@/src/components/alarm/AlarmButton';
import React from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import PageBackButton from '../../../components/common/PageBackButton';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import { Day, useAlarmContext } from '../../../contexts/AlarmContext';
import useAppNavigation from '../../../hooks/useAppNavigation';
import BottomLayout from '../../../Layouts/BottomLayout';

import IconBiv from '../../../../assets/images/AlarmBiv.svg';
import IconCalendar from '../../../../assets/images/AlarmCalendar.svg';
import IconMemo from '../../../../assets/images/AlarmMemo.svg';
import IconMusic from '../../../../assets/images/AlarmMusic.svg';
import IconRepeat from '../../../../assets/images/AlarmRepeat.svg';

export default function WakeUpAlarmDetailPage() {
  const navigation = useAppNavigation();
  const weekdays: Day[] = ['월', '화', '수', '목', '금', '토', '일'];
  const { height } = Dimensions.get('window');
  const { selectedAlarmId, wakeupAlarms, selectedDay, weekdaySwitchStates, setWeekdaySwitchStates, setSelectedDay } = useAlarmContext();

  //debugger;
  const alarm = wakeupAlarms.find((a) => a.serverId === selectedAlarmId);
  // const alarm = wakeupAlarms.find(a => a.serverId === selectedAlarmId);

  if (!alarm) {
    return (
      <BottomLayout>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-xl">알람 정보를 찾을 수 없습니다.</Text>
        </View>
      </BottomLayout>
    );
  }

  const handleToggleSwitchForDay = (day: Day) => {
    setWeekdaySwitchStates((prev) => {
      const nextState = !prev[day];
      console.log(`${day} 기상 알람이 ${nextState ? '켜졌습니다' : '꺼졌습니다'}.`);
      return {
        ...prev,
        [day]: nextState,
      };
    });
  };

  const handleEdit = () => {
    console.log(`${alarm!.title} 기상 알람 설정을 편집합니다`);
    navigation.navigate('EditWakeUpAlarmPage');
  }

  return (
    <BottomLayout>
      <View className="flex-row items-center justify-between mr-[4%]"
        style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
        <PageBackButton goTo="WakeUpAlarmPage" />

        <Text className='font-pretendard text-white text-[24px]'>
          {selectedDay}요일 기상 알람
        </Text>
        <ToggleSwitch
          isOn={selectedDay ? weekdaySwitchStates[selectedDay] : false}
          onToggle={() => {
            if (selectedDay) handleToggleSwitchForDay(selectedDay);
          }}
          disabled={!selectedDay}
        />
      </View>

      <View className="bg-black items-center justify-center -mt-5">
        <View className="w-[80%] items-center justify-center"
          style={{ height: Platform.OS === 'web' ? height * 0.28 : height * 0.28 }}>
          <View className="flex-row items-center">
            <Text className="font-pretendard text-white text-[33px] mt-1">{alarm.time.period}  </Text>
            <Text className="font-pretendard text-white text-[42px] ml-2">
              {String(alarm.time.hour).padStart(2, '0')} : {String(alarm.time.minute).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>

      <View className="w-full h-[55%] items-center gap-3 space-y-3">
        <View className="w-[91%] h-[90px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3">
          <View className="flex-row items-center">
            <IconCalendar width={20} height={20} />
            <Text className="font-pretendard text-gray-200 text-xl ml-2">반복요일</Text>
          </View>

          <View className="flex-row items-center justify-center gap-x-4 mt-[2%] mx-4"
            style={{ marginLeft: Platform.OS === 'web' ? 40 : 0 }}>
            {weekdays.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <View
                  key={day}
                  className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-[#CCCCFF]' : ''
                    }`}
                >
                  <Text
                    className={`text-xl ${isSelected ? 'text-black font-semibold' : 'text-white'
                      }`}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="w-[91%] flex-row gap-3">
          <View className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3">
            <View className="flex-row items-center justify-between pr-3">
              <View className="flex-row items-center">
                <IconMusic width={20} height={20} />
                <Text className="font-pretendard text-gray-200 text-xl ml-2">알람음</Text>
              </View>
              <View pointerEvents="none">
                <ToggleSwitch isOn={!!alarm.isSound} onToggle={() => { }} />
              </View>
            </View>
            <View
              pointerEvents="none"
              className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center"
            >
              <Text className="font-pretendard text-gray-200 text-[19px] font-semibold">
                {alarm.sound && alarm.sound !== '선택' ? alarm.sound : '-'}
              </Text>
            </View>
          </View>

          <View className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3">
            <View className="flex-row items-center justify-between pr-3">
              <View className="flex-row items-center">
                <IconBiv width={20} height={20} />
                <Text className="font-pretendard text-gray-200 text-xl ml-2">진동</Text>
              </View>
              <View pointerEvents="none">
                <ToggleSwitch isOn={!!alarm.isVibrating} onToggle={() => { }} />
              </View>
            </View>
            <View
              pointerEvents="none"
              className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center"
            >
              <Text className="font-pretendard text-gray-200 text-[19px] font-semibold">
                {alarm.vibrate && alarm.vibrate !== '선택' ? alarm.vibrate : '-'}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-[91%] h-[80px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 px-3">
          <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center">
              <IconRepeat width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">다시 울림</Text>
            </View>
            <View pointerEvents="none">
              <ToggleSwitch isOn={!!alarm.isRepeating} onToggle={() => { }} />
            </View>
          </View>
          <Text className="font-pretendard text-gray-200 text-[19px] font-semibold ml-2">
            {alarm.repeat && alarm.repeat !== '선택' ? alarm.repeat : '-'}
          </Text>
        </View>

        <View
          className="w-[91%] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
          style={{ height: Platform.OS === 'web' ? height * 0.11 : height * 0.09 }}
        >
          <View className="flex-row items-center">
            <IconMemo width={20} height={20} />
            <Text className="font-pretendard text-gray-200 text-[19px] font-semibold ml-2">메모</Text>
          </View>
          <Text className="font-pretendard text-gray-200 text-xl ml-2">
            {alarm.memo.trim() !== '' ? alarm.memo : '-'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center -mt-[6%]">
        <AlarmButton title="편집" onPress={handleEdit} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
      </View>

    </BottomLayout>
  );
}