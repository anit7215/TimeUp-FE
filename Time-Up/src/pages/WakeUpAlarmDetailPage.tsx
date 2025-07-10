// src/pages/WakeUpAlarmDetailPage.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HalfTimeScrollPanel from '../components/common/HalfTimeScrollPanel';
import ToggleSwitch from '../components/common/ToggleSwitch';
import BottomLayout from '../Layouts/BottomLayout';

export default function WakeUpAlarmDetailPage() {
  const navigation = useNavigation();
  const [on, setOn] = useState(false);
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])
  
  return (
    <BottomLayout>
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-black">
        <View className="flex-row items-center mt-[15%]">
          <Text className='font-pretendard text-white text-[24px] ml-[4%] mr-[45%]'>월요일 기상 알람</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="bg-black">
          <HalfTimeScrollPanel />
        </View>
      </SafeAreaView>
    </BottomLayout>
  );
}
