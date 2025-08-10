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
import { useSchedule } from '../context/ScheduleContext';
import BeforeHeader from '../components/common/BeforeHeader';
import { ensureRecurrenceRule, toggleWeekDay } from '../helpers/recurrence';

export default function SetScheduleRepeatPage() {
  const navigation = useNavigation();
  const { state, dispatch } = useSchedule();

  // 1) 전역 draft에서 초기 스냅샷 뽑기
  const initialRule = useMemo(
    () => ensureRecurrenceRule(state.draft.recurrenceRule),
    [state.draft.recurrenceRule]
  );

  // 2) 로컬 임시 상태
  const [localRule, setLocalRule] = useState(initialRule);
  const [isRecurring, setIsRecurring] = useState(state.draft.is_recurring);-

  // 5) 요일 토글 등 UI 이벤트는 전부 로컬만 수정
  const onToggleWeeklyDay = (day: number) => {
    setIsRecurring(true);
    setLocalRule((prev) => ({
      ...prev,
      repeatType: 'weekly',
      repeatWeekDays: toggleWeekday(prev.repeatWeekDays, day),
    }));
  };

  const setRepeatMode = (mode: 'count' | 'until') =>
    setLocalRule((p) => ({ ...p, repeatMode: mode }));

  const setRepeatCount = (count: number) =>
    setLocalRule((p) => ({ ...p, repeatCount: String(count) }));

  const setRepeatUntilDate = (iso: string | null) =>
    setLocalRule((p) => ({ ...p, repeatUntilDate: iso }));

  // 6) 확인 시에만 전역 draft 반영
  const handleConfirm = () => {
    dispatch({
      type: 'UPDATE_DRAFT',
      payload: {
        is_recurring: isRecurring,
        recurrenceRule: localRule,
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

      <BeforeHeader rightLabel="확인" onRightPress={() => handleConfirm}/>

      <View className="flex-column ml-[16px] mr-[16px] pl-4">
        <Text className="text-white text-[20px]">반복 주기</Text>

        <View className="flex-row p-4">
          <CheckBox
            isChecked={repeatType === 'weekly'}
            onValueChangeHandler={() => setRepeatType(prev => (prev === 'weekly' ? null : 'weekly'))}
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
                  onPress={() => onToggleWeeklyDay(day)}
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
