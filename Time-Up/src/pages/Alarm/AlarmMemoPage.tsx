// src/pages/AlarmMemoPage.tsx
import AlarmButton from '@/src/components/alarm/AlarmButton';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import { formatDate, formatTime } from '@/src/utils/AlarmFormat';
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';
import BottomLayout from '../../Layouts/BottomLayout';


export default function AlarmMemoPage() {
  const { selectedAlarmId, myAlarms } = useAlarmContext();

  // 임시 데이터
  const alarm = myAlarms.find((a) => a.id === selectedAlarmId);
  const title = alarm?.title ?? '';
  const date = alarm?.date ?? { fullDate: '2025-06-30', dayOfWeek: '월' };
  const time = alarm?.time ?? { period: '오전', hour: 7, minute: 0 };

  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);
  const { height } = Dimensions.get('window');
  const [memo, setMemo] = useState(alarm?.memo ?? '');
  const { setMyAlarms } = useAlarmContext();

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleSave = () => {
    if (!alarm) return;

    setMyAlarms((prev) =>
      prev.map((a) =>
        a.id === alarm.id ? { ...a, memo } : a
      )
    );

    console.log(`${alarm.title} 메모가 저장되었습니다:`, memo);
    navigation.goBack();
  };

  const handleCancel = () => {
    console.log(`${alarm!.title} 메모가 취소되었습니다`)
    navigation.goBack();
  }

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

      <View className="h-full bg-gray-800 rounded-t-[30px]">
        <View className="h-[50%] w-[90%] border border-gray-400 rounded-2xl self-center mt-[8%] px-4 py-3">
          <TextInput
            multiline
            value={memo}
            onChangeText={setMemo}
            placeholder="내용 입력"
            placeholderTextColor="#CFD3D7"
            style={{
              backgroundColor: '#33373B',
              color: '#CFD3D7',
              fontSize: 18,
              fontFamily: 'pretendard',
              textAlignVertical: 'top',
              flex: 1,
            }}
          />
        </View>

        <View className="flex-row items-center justify-center gap-10 mt-[6%]">
          <AlarmButton title="취소" onPress={handleCancel} backgroundColor="#52565A" textColor="#CFD3D7" style={{ width: 120, height: 48 }} />
          <AlarmButton title="저장" onPress={handleSave} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
        </View>


      </View>
    </BottomLayout>
  );
}
