// src/pages/SelectAlarmVibratePage.tsx
import React from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmVibratePage() {
  const navigation = useAppNavigation();
  const [selectedVibration, setSelectedVibration] = React.useState<string | null>(null);

  const vibrationOptions = ['Basic Ring', 'Soft Buzz', 'Sharp Pulse', 'Heartbeat', 'Heavy Hit'];

  const handleConfirm = () => {
    console.log('확인 버튼 클릭됨');
    navigation.goBack();
  };

  const handleSelectVibration = (vibration: string) => {
    setSelectedVibration(vibration);
    console.log(`선택된 진동 패턴: ${vibration}`);
  };

  return (
    <BottomLayout>
      <View className="flex-row mt-3 items-center justify-between">
        <PageBackButton />
        <TransparentButton title="확인" onPress={handleConfirm} />
      </View>
      <Text className="text-xl text-white ml-9 mt-8">진동</Text>

      {vibrationOptions.map((vibration) => (
        <View key={vibration} className="flex-row ml-9 mt-6">
          <CheckBox
            isChecked={selectedVibration === vibration}
            onValueChangeHandler={() => handleSelectVibration(vibration)}
            disabled={false}
          />
          <Text className="text-white text-xl ml-4">{vibration}</Text>
        </View>
      ))}

    </BottomLayout>
  );
}
