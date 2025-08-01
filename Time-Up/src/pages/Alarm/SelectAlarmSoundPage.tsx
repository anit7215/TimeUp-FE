// src/pages/SelectAlarmSoundPage.tsx
import ToggleSwitch from '@/src/components/common/ToggleSwitch';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmSoundPage() {
  const navigation = useAppNavigation();
  const { selectedAlarmId, myAlarms, updateAlarmField } = useAlarmContext();
  const alarm = myAlarms.find(a => a.id === selectedAlarmId);
  const [selectedSound, setSelectedSound] = useState<string | null>(alarm?.sound ?? null);
  const [on, setOn] = useState(false);

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, []);

  const soundOptions = ['Heavy Raindrop', 'Basic Ring', 'Ocean Wave', 'Bird Chirp', 'Classic Bell'];

  const handleConfirm = () => {
    if (selectedAlarmId && selectedSound) {
      updateAlarmField(selectedAlarmId, 'sound', selectedSound);
      console.log('알람음 저장됨:', selectedSound);
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
        <Text className='text-white text-2xl ml-[7%]'>알람음</Text>
        <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
      </View>

      {soundOptions.map((sound) => (
        <View key={sound} className="flex-row ml-9 mt-6">
          <CheckBox
            isChecked={selectedSound === sound}
            onValueChangeHandler={() => {
              if (selectedSound === sound) {
                console.log('이미 선택된 알람음입니다. 중복 선택을 방지합니다.');
                return;
              }
              setSelectedSound(sound);
            }}
            disabled={false}
          />
          <Text className="text-white text-xl ml-4">{sound}</Text>
        </View>
      ))}
    </BottomLayout>
  );
}
