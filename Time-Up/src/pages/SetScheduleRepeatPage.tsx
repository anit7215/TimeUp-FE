// SetScheduleRepeatPage.tsx
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import BeforeHeader from '../components/common/BeforeHeader';
import CheckBox from '../components/common/CheckBox';
import CustomCalendar from '../components/SetSchedule/CustomCalendar';

import { useSchedule } from '../context/ScheduleContext';
import { ensureRecurrenceRule, toggleWeekday } from '../helpers/recurrence';

// 요일 라벨 (0=일, 6=토)
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

// ⭐ 타임존 안전하게 "일자/요일" 뽑기 유틸
const toLocalDate = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const nthWeekOfMonth = (date: Date) => Math.floor((date.getDate() - 1) / 7) + 1;

export default function SetScheduleRepeatPage() {
  const navigation = useNavigation();
  const { state, dispatch } = useSchedule();

  // 전역 draft의 recurrenceRule을 안전한 기본형으로
  const initialRule = useMemo(
    () => ensureRecurrenceRule(state.draft.recurrenceRule),
    [state.draft.recurrenceRule]
  );
  

  // ⭐ 전역 시작일에서 파생값 만들기
  const startLocal = useMemo(() => toLocalDate(state.draft.start_date) ?? new Date(), [state.draft.start_date]);
  const startDayOfMonth = startLocal.getDate(); // ex) 21
  const startWeekday = startLocal.getDay();     // 0~6
  const startNth = nthWeekOfMonth(startLocal);  // 1~5
  const startWeekdayLabel = DAY_LABELS[startWeekday];

  // ========== 로컬 임시 상태 ==========
  const [repeatType, setRepeatType] = useState<null | 'weekly' | 'monthly'>(initialRule.repeatType);
  // ⭐ 주 반복 기본값: rule에 없으면 시작일의 요일로 초기화
  const [weekdays, setWeekdays] = useState<number[]>(
    initialRule.repeatWeekDays && initialRule.repeatWeekDays.length
      ? initialRule.repeatWeekDays
      : [startWeekday]
  );
  const [endMode, setEndMode] = useState<'count' | 'until'>(initialRule.repeatMode === 'until' ? 'until' : 'count');
  const [repeatCount, setRepeatCount] = useState<number>(() => {
    const n = Number(initialRule.repeatCount ?? 1);
    return Number.isFinite(n) && n > 0 ? n : 1;
  });
  const [untilDate, setUntilDate] = useState<string | null>(initialRule.repeatUntilDate ?? null);

  // monthly 옵션
  const [monthlyOption, setMonthlyOption] = useState<null | 'day_of_month' | 'nth_weekday'>(
    (initialRule.monthlyOption as any) ?? null
  );
  // ⭐ 월 n일 기본값: rule에 없으면 시작일의 '일자'로
  const [dayOfMonth, setDayOfMonth] = useState<number | null>(
    initialRule.dayOfMonth ?? startDayOfMonth
  );
  // ⭐ 월 n번째 요일 기본값: rule에 없으면 시작일의 (n번째, 요일)로
  const [nthWeek, setNthWeek] = useState<number | null>(
    initialRule.nthWeek ?? startNth
  );
  const [monthlyWeekday, setMonthlyWeekday] = useState<number | null>(
    initialRule.weekday?.length ? Number(initialRule.weekday[0]) : startWeekday
  );

  const isDayOfMonthSelected =
  repeatType === 'monthly' &&
  monthlyOption === 'day_of_month' &&
  dayOfMonth === startDayOfMonth;

const isNthWeekdaySelected =
  repeatType === 'monthly' &&
  monthlyOption === 'nth_weekday' &&
  nthWeek === startNth &&
  monthlyWeekday === startWeekday;

  // ⭐ 전역 start_date가 바뀌면 로컬 기본값도 재동기화
  useEffect(() => {
    setWeekdays((prev) =>
      initialRule.repeatWeekDays && initialRule.repeatWeekDays.length ? prev : [startWeekday]
    );
    setDayOfMonth((prev) => (initialRule.dayOfMonth != null ? prev : startDayOfMonth));
    setNthWeek((prev) => (initialRule.nthWeek != null ? prev : startNth));
    setMonthlyWeekday((prev) =>
      initialRule.weekday?.length ? prev : startWeekday
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWeekday, startDayOfMonth, startNth]);

  // 종료 날짜 바텀시트
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  // 요일 토글(로컬만)
  const onToggleWeeklyDay = (dayIndex: number) => {
    setRepeatType('weekly');
    setWeekdays(prev => toggleWeekday(prev, dayIndex));
  };

  // 종료 방식 선택
  const handleEndType = (mode: 'count' | 'until') => {
    setEndMode(mode);
    if (mode === 'count') setUntilDate(null);
  };

  // 반복 횟수 입력
  const handleNumChange = (v: string) => {
    const n = Number(v.replace(/\D+/g, ''));
    if (!Number.isFinite(n)) return;
    setRepeatCount(n || 1);
  };

  // ⭐ 시작일 기준 빠른 선택 액션
  const pickMonthlyByStartDay = () => {
    setRepeatType('monthly');
    setMonthlyOption('day_of_month');
    setDayOfMonth(startDayOfMonth);
    
  };
  const pickMonthlyByStartNthWeekday = () => {
    setRepeatType('monthly');
    setMonthlyOption('nth_weekday');
    setNthWeek(startNth);
    setMonthlyWeekday(startWeekday);
  };

  // 확인 → 전역 draft에 반영
  const handleConfirm = () => {
    // 반복 안 쓰면 clean-up
    if (!repeatType) {
      dispatch({
        type: 'UPDATE_DRAFT',
        payload: {
          is_recurring: false,
          recurrenceRule: {
            repeatType: null,
            repeatWeekDays: [],
            monthlyOption: null,
            dayOfMonth: null,
            nthWeek: null,
            weekday: [],
            repeatMode: 'count',
            repeatCount: null,
            repeatUntilDate: null,
          },
        },
      });
      navigation.goBack();
      return;
    }

    // 반복 사용 시 rule 구성
    const nextRule = ensureRecurrenceRule({
      repeatType,
      repeatWeekDays: repeatType === 'weekly' ? weekdays : [],
      monthlyOption: repeatType === 'monthly' ? monthlyOption ?? null : null,
      dayOfMonth: repeatType === 'monthly' && monthlyOption === 'day_of_month' ? dayOfMonth ?? null : null,
      nthWeek: repeatType === 'monthly' && monthlyOption === 'nth_weekday' ? nthWeek ?? null : null,
      weekday:
        repeatType === 'monthly' && monthlyOption === 'nth_weekday' && monthlyWeekday != null
          ? [(monthlyWeekday)]
          : [],
      repeatMode: endMode,
      repeatCount: endMode === 'count' ? (repeatCount) : null,
      repeatUntilDate: endMode === 'until' ? untilDate : null,
    });


    dispatch({
      type: 'UPDATE_DRAFT',
      payload: {
        is_recurring: true,
        recurrenceRule: nextRule,
      },
    });

    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-[#121212] px-4">
      {/* 종료 날짜 선택 BottomSheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={() => {}}
        backgroundStyle={{ backgroundColor: '#33363B' }}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <CustomCalendar
            initialDate={state.draft.start_date || undefined}
            onSelectDate={(dateISO) => {
              setUntilDate(dateISO);
              bottomSheetModalRef.current?.dismiss();
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>

      <BeforeHeader rightLabel="확인" onRightPress={handleConfirm} />

      {/* 반복 주기 */}
      <View className="ml-[16px] mr-[16px] pl-4">
        <Text className="text-white text-[20px]">반복 주기</Text>

        {/* 주 반복 선택 */}
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
            {DAY_LABELS.map((label, idx) => {
              const isSelected = weekdays.includes(idx);
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => onToggleWeeklyDay(idx)}
                  className={`w-8 h-8 mx-1 rounded-full items-center justify-center border ${isSelected ? 'border-white' : 'border-0'}`}
                >
                  <Text className="text-white text-[20px]">{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 월 반복 선택 */}
        <View className="flex-row pl-4">
          <CheckBox
            isChecked={repeatType === 'monthly'}
            onValueChangeHandler={() => setRepeatType(prev => (prev === 'monthly' ? null : 'monthly'))}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">1개월마다</Text>
        </View>

        {repeatType === 'monthly' && (
          <View className="m-4">
            {/* ⭐ 시작일 기준 빠른 선택 버튼 2개 */}
            <TouchableOpacity
              
              onPress={pickMonthlyByStartDay}
              className={`bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center ${ isDayOfMonthSelected ? 'bg-blue' : 'bg-gray'}`}
            >
              <Text className="text-white text-[18px]">
                {startDayOfMonth}일마다 반복
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickMonthlyByStartNthWeekday}
              className={`bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center ${ isNthWeekdaySelected ? 'bg-blue' : 'bg-gray'}`}
            >
              <Text className="text-white text-[18px]">
                {startNth}번째 {startWeekdayLabel}요일마다 반복
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 반복 기간 */}
      <View className="ml-[16px] mr-[16px] pl-4 pt-4">
        <Text className="text-white text-[20px]">반복 기간</Text>

        {/* 횟수로 제한 */}
        <View className="flex-row p-4">
          <CheckBox
            isChecked={endMode === 'count'}
            onValueChangeHandler={() => handleEndType('count')}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">일정 횟수 반복</Text>
        </View>

        {endMode === 'count' && (
          <View className="flex-row justify-center items-center">
            <TextInput
              keyboardType="numeric"
              value={String(repeatCount)}
              onChangeText={handleNumChange}
              className="text-white border-b border-white p-2 text-[25px] w-20 text-center"
            />
            <Text className="text-white text-[25px] ml-2">회 반복</Text>
          </View>
        )}

        {/* 날짜로 제한 */}
        <View className="flex-row pl-4 mt-2">
          <CheckBox
            isChecked={endMode === 'until'}
            onValueChangeHandler={() => {
              handleEndType('until');
              bottomSheetModalRef.current?.present();
            }}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">종료 날짜 설정</Text>
        </View>

        {endMode === 'until' && (
          <Text className="text-gray-300 ml-12 mt-1">
            {untilDate ? `선택한 종료일: ${untilDate}` : '종료일을 선택하세요'}
          </Text>
        )}
      </View>
    </View>
  );
}
