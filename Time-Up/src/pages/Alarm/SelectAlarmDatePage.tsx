// src/pages/SelectAlarmDatePage.tsx
import BottomLayout from '@/src/Layouts/BottomLayout';
import TransparentButton from '@/src/components/alarm/TransparentButton';
import ToggleSwitch from '@/src/components/common/ToggleSwitch';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmDatePage() {
  const navigation = useAppNavigation();
  const { height } = Dimensions.get('window');
  const { selectedAlarmDate, setSelectedAlarmDate } = useAlarmContext();
  const [currentDate, setCurrentDate] = useState(selectedAlarmDate);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []) // 모달 얼마나 열리는지 설정

  const handleSelect = () => {
    console.log('날짜를 선택합니다:', currentDate);
    setSelectedAlarmDate(currentDate);
    navigation.goBack();
  };

  const handleCancel = () => {
    console.log('날짜 선택을 취소합니다.');
    navigation.goBack();
  };

  const getDayOfWeek = (dateString: string) => {
    const dayNum = new Date(dateString).getDay();
    return ['일', '월', '화', '수', '목', '금', '토'][dayNum];
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomLayout>
        <View className="mt-5 px-5">
          <Calendar
            key={currentDate}
            current={currentDate}
            theme={{
              calendarBackground: '#33363B',
              textDisabledColor: 'gray',
            }}
            markedDates={{
              [currentDate]: {
                selected: true,
                selectedColor: 'blue',
              },
            }}
            renderHeader={(date) => (
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {moment(date).format('M월 YYYY')}
              </Text>
            )}
            dayComponent={({ date, state }) => {
              if (!date) return null;
              const dateString = date.dateString;
              const day = date.day;
              const dayOfWeek = new Date(dateString).getDay();
              const isSelected = dateString === currentDate;

              const getTextColor = () => {
                if (state === 'disabled') return 'gray';
                if (isSelected) return 'white';
                if (dayOfWeek === 0) return '#FF3B30';
                if (dayOfWeek === 6) return '#007AFF';
                return 'white';
              };

              return (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentDate(dateString);
                    setSelectedAlarmDate(dateString); // 날짜 변경됨
                  }}
                >
                  <View
                    className={`w-10 h-10 justify-center items-center rounded-full ${isSelected ? 'bg-blue-600' : ''}`}
                  >
                    <Text style={{ color: getTextColor(), fontSize: 16 }}>{day}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>



       <View className="flex-row items-center justify-between mr-[4%]"
          style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
          <Text className='font-pretendard text-white text-[24px] ml-[4%]'>알람 날짜</Text>
          <ToggleSwitch isOn={true} onToggle={() => {}} disabled />
        </View>

        <View className="bg-black items-center justify-center mt-[15%]">
          <View className="w-[80%] items-center justify-center"
            style={{ height: Platform.OS === 'web' ? height * 0.20 : height * 0.22 }}>
            <Text className="font-pretendard text-white text-3xl mb-4">
              {moment(currentDate).format(`M월 D일 (${getDayOfWeek(currentDate)})`)}
            </Text>
            <Text className="font-pretendard text-white text-[40px]">오전 12 : 00</Text>
          </View>
        </View>


        <View className="flex-row items-center justify-center mx-4 gap-3"
          style={{ marginTop: Platform.OS === 'web' ? 60 : 20 }}>
          <TransparentButton title="취소" onPress={handleCancel} />
          <TransparentButton title="선택" onPress={handleSelect} />
        </View>
      </BottomLayout>
    </GestureHandlerRootView>
  );
}
