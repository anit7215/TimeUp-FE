// src/pages/SelectAlarmVibratePage.tsx
import ToggleSwitch from '@/src/components/common/ToggleSwitch';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmVibratePage() {
  const navigation = useAppNavigation();
  const { selectedAlarmId, myAlarms, updateAlarmField } = useAlarmContext();
  const alarm = myAlarms.find(a => a.id === selectedAlarmId);
  const [selectedVibration, setSelectedVibration] = useState<string | null>(alarm?.vibrate ?? null);
  const [on, setOn] = useState(false);

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, []);

  const vibrationOptions = ['Basic Ring', 'Soft Buzz', 'Sharp Pulse', 'Heartbeat', 'Heavy Hit'];

  const handleConfirm = () => {
    if (selectedAlarmId && selectedVibration) {
      updateAlarmField(selectedAlarmId, 'vibrate', selectedVibration);
      console.log('진동 저장됨:', selectedVibration);
    }
    navigation.goBack();
  };

  return (
    <BottomLayout>
      <View className="flex-row mt-3 mb-3 items-center justify-start">
        <PageBackButton />
        <View className="ml-auto -mr-6">
          <TransparentButton title="확인" onPress={handleConfirm} />
        </View>
      </View>

      <View className="flex-row w-[93%] mb-[3%] items-center justify-between">
        <Text className='text-white text-2xl ml-[7%]'>진동</Text>
        <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
      </View>

      {vibrationOptions.map((vibration) => (
        <View key={vibration} className="flex-row ml-9 mt-6">
          <CheckBox
            isChecked={selectedVibration === vibration}
            onValueChangeHandler={() => {
              if (selectedVibration === vibration) {
                console.log('이미 선택된 진동입니다. 중복 선택을 방지합니다.');
                return;
              }
              setSelectedVibration(vibration);
            }}
            disabled={false}
          />
          <Text className="text-white text-xl ml-4">{vibration}</Text>
        </View>
      ))}
    </BottomLayout>
  );
}
