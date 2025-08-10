// SetScheduleRepeatPage.tsx - 전역 상태(draft) 기반 리팩토링

import {
  BottomSheetModal, BottomSheetView
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '../components/common/CheckBox';
import CustomCalendar from '../components/SetSchedule/CustomCalendar';
import LeftArrowIcon from '../../assets/icons/LeftArrowIcon.svg';
import { useSchedule } from '../context/ScheduleContext';

export default function SetScheduleRepeatPage() {
  const navigation = useNavigation();
  const { state, dispatch } = useSchedule();
  const form = state.draft;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(form.end_date || '');
  const [repeatType, setRepeatType] = useState<'weekly' | 'monthly' | 'none'>(form.repeat_type || 'none');
  const [selectedWeekdays, setSelectedWeekdays] = useState<{ [key: string]: boolean }>(form.repeat_days || {
    Sun: false, Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false
  });
  const [endType, setEndType] = useState<'setRepeatNum' | 'setEndDay' | null>(form.repeat_end_type || null);
  const [value, setValue] = useState(form.repeat_count ? form.repeat_count.toString() : '');

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);
  const dayMap: { [key: string]: string } = {
    '일': 'Sun', '월': 'Mon', '화': 'Tue', '수': 'Wed', '목': 'Thu', '금': 'Fri', '토': 'Sat'
  };

  const toggleWeekday = (korDay: string) => {
    const engDay = dayMap[korDay];
    setSelectedWeekdays(prev => ({ ...prev, [engDay]: !prev[engDay] }));
  };

  const handleEndType = (type: 'setRepeatNum' | 'setEndDay') => {
    setEndType(type);
  };

  const handleNumChange = (text: string) => {
    const onlyNumbers = text.replace(/[^0-9]/g, '');
    const num = parseInt(onlyNumbers || '0', 10);
    if (num > 100) return;
    setValue(onlyNumbers);
  };

  const handleConfirm = () => {
    dispatch({
      type: 'UPDATE_DRAFT',
      payload: {
        repeat: repeatType !== 'none',
        repeat_type: repeatType,
        repeat_days: repeatType === 'weekly' ? selectedWeekdays : undefined,
        repeat_count: endType === 'setRepeatNum' ? parseInt(value) : undefined,
        end_date: endType === 'setEndDay' ? selectedDate : undefined,
        repeat_end_type: endType,
        is_recurring: true
      },
    });
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-[#121212] pt-20 px-4">
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={() => {}}
        backgroundStyle={{ backgroundColor: '#33363B' }}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          {selectedItem === '종료 날짜 설정' && (
            <CustomCalendar
              initialDate={form.start_date}
              onSelectDate={(date) => {
                setSelectedDate(date);
              }}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>

      <View className="flex-row space-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrowIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirm}
          style={{ marginTop: 40, padding: 16, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>확인</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-column ml-[16px] mr-[16px] pl-4 pt-4">
        <Text className="text-white text-[20px]">반복 주기</Text>

        <View className="flex-row p-4">
          <CheckBox
            isChecked={repeatType === 'weekly'}
            onValueChangeHandler={() => setRepeatType(prev => (prev === 'weekly' ? 'none' : 'weekly'))}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">1주마다</Text>
        </View>

        {repeatType === 'weekly' && (
          <View className="flex-row items-center justify-center mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => {
              const engDay = dayMap[day];
              const isSelected = selectedWeekdays[engDay];
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleWeekday(day)}
                  className={`w-8 h-8 mx-1 rounded-full items-center justify-center border ${isSelected ? 'border-white' : 'border-0'}`}
                >
                  <Text className="text-white text-[20px]">{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View className="flex-row pl-4">
          <CheckBox
            isChecked={repeatType === 'monthly'}
            onValueChangeHandler={() => setRepeatType(prev => (prev === 'monthly' ? 'none' : 'monthly'))}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">1개월마다</Text>
        </View>

        {repeatType === 'monthly' && (
          <View className="m-4">
            <TouchableOpacity className="bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center">
              <Text className="text-white text-[18px]">21일마다 반복</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center">
              <Text className="text-white text-[18px]">세 번째 수요일마다 반복</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="flex-column ml-[16px] mr-[16px] pl-4 pt-4">
        <Text className="text-white text-[20px]">반복 기간</Text>

        <View className="flex-row p-4">
          <CheckBox
            isChecked={endType === 'setRepeatNum'}
            onValueChangeHandler={() => handleEndType('setRepeatNum')}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">일정 횟수 반복</Text>
        </View>

        {endType === 'setRepeatNum' && (
          <View className="flex-row justify-center items-center">
            <TextInput
              keyboardType="numeric"
              value={value}
              onChangeText={handleNumChange}
              className="text-white border-b border-white p-2 text-[25px]"
            />
            <Text className="text-white text-[25px]">회 반복</Text>
          </View>
        )}

        <View className="flex-row pl-4">
          <CheckBox
            isChecked={endType === 'setEndDay'}
            onValueChangeHandler={() => {
              handleEndType('setEndDay');
              setSelectedItem('종료 날짜 설정');
              bottomSheetModalRef.current?.present();
            }}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">종료 날짜 설정</Text>
        </View>
      </View>
    </View>
  );
}
