// src/pages/SelectAlarmReplayPage.tsx
import ToggleSwitch from '@/src/components/common/ToggleSwitch';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmReplayPage() {
  const navigation = useAppNavigation();
  const { selectedAlarmId, myAlarms, updateAlarmField } = useAlarmContext();
  const alarm = myAlarms.find(a => a.id === selectedAlarmId);

  const [selectedInterval, setSelectedInterval] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState<string | null>(null);
  const [on, setOn] = useState(false);

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, []);

  const handleConfirm = () => {
    if (selectedAlarmId) {
      const repeatText = `${selectedInterval ?? ''}, ${selectedCount ?? ''}`;
      updateAlarmField(selectedAlarmId, 'repeat', repeatText);
      console.log('다시 울림 저장됨:', repeatText);
    }
    navigation.goBack();
  };

  useEffect(() => {
    if (alarm?.repeat) {
      const [interval, count] = alarm.repeat.split(',').map((s) => s.trim());
      setSelectedInterval(interval || null);
      setSelectedCount(count || null);
    }
  }, [alarm?.repeat]);

  return (
    <BottomLayout>
      <View className="flex-row mt-3 mb-3 items-center justify-start">
        <PageBackButton />
        <View className="ml-auto -mr-6">
          <TransparentButton title="확인" onPress={handleConfirm} />
        </View>
      </View>

      <View className="flex-row w-[93%] mb-[5%] items-center justify-between">
        <Text className='text-white text-2xl ml-[7%]'>다시 울림</Text>
        <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
      </View>

      <View className='h-[30%] w-[90%] bg-gray-900 self-center rounded-3xl'>
        <Text className="text-xl text-white ml-5 mt-5">간격</Text>
        {['5분', '10분', '15분', '20분'].map(option => (
          <View key={option} className="flex-row ml-5 mt-6">
            <CheckBox
              isChecked={selectedInterval === option}
              onValueChangeHandler={() => {
                if (selectedInterval === option) {
                  console.log('이미 선택된 간격입니다. 중복 선택을 방지합니다.');
                  return;
                }
                setSelectedInterval(option);
              }}
              disabled={false}
            />
            <Text className="text-white text-xl ml-4">{option}</Text>
          </View>
        ))}
      </View>

      <View className='h-[19%] w-[90%] bg-gray-900 self-center rounded-3xl mt-3'>
        <Text className="text-xl text-white ml-5 mt-5">기간</Text>
        {['3회', '5회'].map(option => (
          <View key={option} className="flex-row ml-5 mt-6">
            <CheckBox
              isChecked={selectedCount === option}
              onValueChangeHandler={() => {
                if (selectedCount === option) {
                  console.log('이미 선택된 기간입니다. 중복 선택을 방지합니다.');
                  return;
                }
                setSelectedCount(option);
              }}
              disabled={false}
            />
            <Text className="text-white text-xl ml-4">{option}</Text>
          </View>
        ))}
      </View>
    </BottomLayout>
  );
}
