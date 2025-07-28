// src/pages/EditMyAlarmPage.tsx
import AlarmButton from '@/src/components/alarm/AlarmButton';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import type { MyAlarm } from '@/src/types/alarm';
import { formatDate, formatTime } from '@/src/utils/AlarmFormat';
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';
import BottomLayout from '../../Layouts/BottomLayout';

import IconBiv from '../../../assets/images/AlarmBiv.svg';
import IconMemo from '../../../assets/images/AlarmMemo.svg';
import IconMusic from '../../../assets/images/AlarmMusic.svg';
import IconRepeat from '../../../assets/images/AlarmRepeat.svg';

export default function EditMyAlarmPage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);
  const { height } = Dimensions.get('window');
  const { selectedAlarmId, myAlarms, setMyAlarms } = useAlarmContext();

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const alarmToEdit = myAlarms.find(a => a.id === selectedAlarmId);

  // 수정용 초기값 설정. 알람 상세 설정 상태 관리 구현 후 제거하기.
  const [title, setTitle] = useState(alarmToEdit?.title ?? '');
  const [time, setTime] = useState<MyAlarm['time']>(
    alarmToEdit?.time ?? { period: '오전', hour: 7, minute: 0 }
  );
  const [date, setDate] = useState<MyAlarm['date']>(
    alarmToEdit?.date ?? { fullDate: '2025-06-30', dayOfWeek: '월' }
  );
  const [sound, setSound] = useState(alarmToEdit?.sound ?? 'Heavy Raindrop');
  const [vibrate, setVibrate] = useState(alarmToEdit?.vibrate ?? true);
  const [repeat, setRepeat] = useState(alarmToEdit?.repeat ?? '10분, 5회');
  const [memo, setMemo] = useState(alarmToEdit?.memo ?? '');
  const [isActive, setIsActive] = useState(alarmToEdit?.isActive ?? true);

  const handleCancel = () => {
    console.log(`${title} 알람 편집을 취소합니다`);
    navigation.goBack();
  };

  const handleSave = () => {
    console.log('내 알람을 저장합니다.');
    if (selectedAlarmId) {
      // 기존 알람 수정
      setMyAlarms(prev =>
        prev.map(alarm =>
          alarm.id === selectedAlarmId
            ? { ...alarm, title, time, date, sound, vibrate, repeat, memo, isActive }
            : alarm
        )
      );
    } else {
      // 새 알람 생성
      const newAlarm = {
        id: Date.now().toString(), // 간단한 ID 생성
        title,
        time,
        date,
        sound,
        vibrate,
        repeat,
        memo,
        isActive,
      };
      setMyAlarms(prev => [...prev, newAlarm]);
    }

    navigation.goBack();
  };

  const handleSelectSound = () => {
    navigation.navigate('SelectAlarmSoundPage');
  };

  const handleSelectVibrate = () => {
    navigation.navigate('SelectAlarmVibratePage');
  };

  const handleSelectReplay = () => {
    navigation.navigate('SelectAlarmReplayPage');
  };

  const handleMemo = () => {
    navigation.navigate('AlarmMemoPage');
  };

  return (
    <BottomLayout>
      <View className="flex-row items-center justify-between mr-[4%]"
        style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
        <Text className='font-pretendard text-white text-[24px] ml-[4%]' style={{ marginTop: Platform.OS === 'web' ? 30 : 0, width: Platform.OS === 'web' ? 380 : 300, }}>{title}</Text>
        <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
      </View>

      <View className="bg-black items-center justify-center">
        <View className="w-[80%] items-center justify-center"
          style={{ height: Platform.OS === 'web' ? height * 0.20 : height * 0.25 }}>
          <Text className="font-pretendard text-white text-3xl mb-4">{formatDate(date)}</Text>
          <Text className="font-pretendard text-white text-[40px]">{formatTime(time)}</Text>
        </View>
      </View>

      <View className="w-full h-[55%] items-center gap-3 space-y-3">
        <View className="w-[91%] flex-row gap-3">
          <TouchableOpacity className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3"
            activeOpacity={0.8}
            onPress={handleSelectSound}
          >
            <View className="flex-row items-center">
              <IconMusic width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">알람음</Text>
            </View>
            <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
              <Text className="font-pretendard text-gray-200 text-xl">선택</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3"
            activeOpacity={0.8}
            onPress={handleSelectVibrate}
          >
            <View className="flex-row items-center">
              <IconBiv width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">진동</Text>
            </View>
            <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
              <Text className="font-pretendard text-gray-200 text-xl">선택</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="w-[91%] h-[80px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
          activeOpacity={0.8}
          onPress={handleSelectReplay}
        >
          <View className="flex-row items-center">
            <IconRepeat width={20} height={20} />
            <Text className="font-pretendard text-gray-200 text-xl ml-2">다시 울림</Text>
          </View>
          <Text className="font-pretendard text-gray-200 text-xl ml-2">선택</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[91%] h-[200px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
          activeOpacity={0.8}
          onPress={handleMemo}
        >
          <View className="flex-row items-center">
            <IconMemo width={20} height={20} />
            <Text className="font-pretendard text-gray-200 text-xl ml-2">메모</Text>
          </View>
          <Text className="font-pretendard text-gray-200 text-xl ml-2">
            {memo.trim() !== '' ? memo : '입력'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center gap-10 mt-[3%]">
        <AlarmButton title="취소" onPress={handleCancel} backgroundColor="#1C1F21" textColor="#CFD3D7" style={{ width: 120, height: 48 }} />
        <AlarmButton title="저장" onPress={handleSave} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
      </View>


    </BottomLayout>
  );
}
