// src/pages/SelectAlarmSoundPage.tsx
import ToggleSwitch from '@/src/components/common/ToggleSwitch';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import React, { useCallback, useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmSoundPage() {
  const navigation = useAppNavigation();
  const { selectedAlarmId, myAlarms, updateAlarmField, setSelectedAlarmId } = useAlarmContext();
  const alarm = myAlarms.find(a => a.id === selectedAlarmId);
  const [selectedSound, setSelectedSound] = useState<string | null>(alarm?.sound ?? null);
  const [on, setOn] = useState(alarm?.isSound ?? false);

  const handleToggleSwitch = useCallback(() => {
    if (!selectedSound || selectedSound === '선택') {
      if (Platform.OS === 'web') {
        window.alert('알람음을 선택해 주세요');
      } else {
        Alert.alert('알림', '알람음을 선택해 주세요');
      }
      return;
    }

    const newState = !on;
    setOn(newState);
    if (selectedAlarmId != null) {
      updateAlarmField(selectedAlarmId, 'isSound', newState);
    }
  }, [on, selectedAlarmId, selectedSound]);

  const soundOptions = ['Heavy Raindrop', 'Basic Ring', 'Ocean Wave', 'Bird Chirp', 'Classic Bell'];

  const handleConfirm = () => {
    //debugger;
     
    if (selectedAlarmId && selectedSound) {
      updateAlarmField(selectedAlarmId, 'sound', selectedSound);
      console.log(`알람음 저장됨: ${selectedSound} / ${on ? '활성화됨' : '비활성화됨'}`);
    } else {
      // 새 알람을 생성한 경우
    //   const newAlarmId = Date.now(); // 고유 ID 생성 (예시)
    //   setSelectedAlarmId(newAlarmId);
    //   updateAlarmField(newAlarmId, 'sound', selectedSound ?? "");
    //   updateAlarmField(newAlarmId, 'isSound', on);
    //   console.log('새 알람 생성 후 알람음 설정됨');

   }
    // if (selectedAlarmId && selectedSound) {
    //   updateAlarmField(selectedAlarmId, 'sound', selectedSound);
    //   console.log(`알람음 저장됨: ${selectedSound} / ${on ? '활성화됨' : '비활성화됨'}`);
    // }
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
