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

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const toLocalDate = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const nthWeekOfMonth = (date: Date) => Math.floor((date.getDate() - 1) / 7) + 1;

export default function SetScheduleRepeatPage() {
  const navigation = useNavigation();
  const { state, dispatch } = useSchedule();

  const initialRule = useMemo(
    () => ensureRecurrenceRule(state.draft.recurrence_rule),
    [state.draft.recurrence_rule]
  );

  const start_local = useMemo(() => toLocalDate(state.draft.start_date) ?? new Date(), [state.draft.start_date]);
  const start_day_of_month = start_local.getDate();
  const start_weekday = start_local.getDay();
  const start_nth = nthWeekOfMonth(start_local);
  const start_weekday_label = DAY_LABELS[start_weekday];

  const [repeat_type, set_repeat_type] = useState<null | 'weekly' | 'monthly'>(initialRule.repeat_type);
  const [repeat_weekdays, set_repeat_weekdays] = useState<number[]>(
    initialRule.repeat_weekdays && initialRule.repeat_weekdays.length
      ? initialRule.repeat_weekdays
      : [start_weekday]
  );
  const [repeat_mode, set_repeat_mode] = useState<'count' | 'until'>(initialRule.repeat_mode === 'until' ? 'until' : 'count');
  const [repeat_count, set_repeat_count] = useState<number>(() => {
    const n = Number(initialRule.repeat_count ?? 1);
    return Number.isFinite(n) && n > 0 ? n : 1;
  });
  const [repeat_until_date, set_repeat_until_date] = useState<string | null>(initialRule.repeat_until_date ?? null);

  const [monthly_option, set_monthly_option] = useState<null | 'day_of_month' | 'nth_weekday'>(
    (initialRule.monthly_option as any) ?? null
  );
  const [day_of_month, set_day_of_month] = useState<number | null>(
    initialRule.day_of_month ?? start_day_of_month
  );
  const [nth_week, set_nth_week] = useState<number | null>(
    initialRule.nth_week ?? start_nth
  );
  const [weekday, set_weekday] = useState<number | null>(
    initialRule.weekday?.length ? Number(initialRule.weekday[0]) : start_weekday
  );

  const is_day_of_month_selected =
    repeat_type === 'monthly' &&
    monthly_option === 'day_of_month' &&
    day_of_month === start_day_of_month;

  const is_nth_weekday_selected =
    repeat_type === 'monthly' &&
    monthly_option === 'nth_weekday' &&
    nth_week === start_nth &&
    weekday === start_weekday;

  useEffect(() => {
    set_repeat_weekdays((prev) =>
      initialRule.repeat_weekdays && initialRule.repeat_weekdays.length ? prev : [start_weekday]
    );
    set_day_of_month((prev) => (initialRule.day_of_month != null ? prev : start_day_of_month));
    set_nth_week((prev) => (initialRule.nth_week != null ? prev : start_nth));
    set_weekday((prev) =>
      initialRule.weekday?.length ? prev : start_weekday
    );
  }, [start_weekday, start_day_of_month, start_nth]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  const onToggleWeeklyDay = (day_index: number) => {
    set_repeat_type('weekly');
    set_repeat_weekdays(prev => toggleWeekday(prev, day_index));
  };

  const handleEndType = (mode: 'count' | 'until') => {
    set_repeat_mode(mode);
    if (mode === 'count') set_repeat_until_date(null);
  };

  const handleNumChange = (v: string) => {
    const n = Number(v.replace(/\D+/g, ''));
    if (!Number.isFinite(n)) return;
    set_repeat_count(n || 1);
  };

  const pickMonthlyByStartDay = () => {
    set_repeat_type('monthly');
    set_monthly_option('day_of_month');
    set_day_of_month(start_day_of_month);
  };
  const pickMonthlyByStartNthWeekday = () => {
    set_repeat_type('monthly');
    set_monthly_option('nth_weekday');
    set_nth_week(start_nth);
    set_weekday(start_weekday);
  };

  const handleConfirm = () => {
    if (!repeat_type) {
      dispatch({
        type: 'UPDATE_DRAFT',
        payload: {
          is_recurring: false,
          recurrence_rule: {
            repeat_type: null,
            repeat_weekdays: [],
            monthly_option: null,
            day_of_month: null,
            nth_week: null,
            weekday: [],
            repeat_mode: 'count',
            repeat_count: null,
            repeat_until_date: null,
          },
        },
      });
      navigation.goBack();
      return;
    }

    const nextRule = ensureRecurrenceRule({
      repeat_type,
      repeat_weekdays: repeat_type === 'weekly' ? repeat_weekdays : [],
      monthly_option: repeat_type === 'monthly' ? monthly_option ?? null : null,
      day_of_month: repeat_type === 'monthly' && monthly_option === 'day_of_month' ? day_of_month ?? null : null,
      nth_week: repeat_type === 'monthly' && monthly_option === 'nth_weekday' ? nth_week ?? null : null,
      weekday:
        repeat_type === 'monthly' && monthly_option === 'nth_weekday' && weekday != null
          ? [weekday]
          : [],
      repeat_mode,
      repeat_count: repeat_mode === 'count' ? repeat_count : null,
      repeat_until_date: repeat_mode === 'until' ? repeat_until_date : null,
    });

    dispatch({
      type: 'UPDATE_DRAFT',
      payload: {
        is_recurring: true,
        recurrence_rule: nextRule,
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
              set_repeat_until_date(dateISO);
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
            isChecked={repeat_type === 'weekly'}
            onValueChangeHandler={() => set_repeat_type(prev => (prev === 'weekly' ? null : 'weekly'))}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">1주마다</Text>
        </View>

        {repeat_type === 'weekly' && (
          <View className="flex-row items-center justify-center mb-2">
            {DAY_LABELS.map((label, idx) => {
              const isSelected = repeat_weekdays.includes(idx);
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
            isChecked={repeat_type === 'monthly'}
            onValueChangeHandler={() => set_repeat_type(prev => (prev === 'monthly' ? null : 'monthly'))}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">1개월마다</Text>
        </View>

        {repeat_type === 'monthly' && (
          <View className="m-4">
            <TouchableOpacity
              onPress={pickMonthlyByStartDay}
              className={`bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center ${ is_day_of_month_selected ? 'bg-blue' : 'bg-gray'}`}
            >
              <Text className="text-white text-[18px]">
                {start_day_of_month}일마다 반복
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickMonthlyByStartNthWeekday}
              className={`bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center ${ is_nth_weekday_selected ? 'bg-blue' : 'bg-gray'}`}
            >
              <Text className="text-white text-[18px]">
                {start_nth}번째 {start_weekday_label}요일마다 반복
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
            isChecked={repeat_mode === 'count'}
            onValueChangeHandler={() => handleEndType('count')}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">일정 횟수 반복</Text>
        </View>

        {repeat_mode === 'count' && (
          <View className="flex-row justify-center items-center">
            <TextInput
              keyboardType="numeric"
              value={String(repeat_count)}
              onChangeText={handleNumChange}
              className="text-white border-b border-white p-2 text-[25px] w-20 text-center"
            />
            <Text className="text-white text-[25px] ml-2">회 반복</Text>
          </View>
        )}

        {/* 날짜로 제한 */}
        <View className="flex-row pl-4 mt-2">
          <CheckBox
            isChecked={repeat_mode === 'until'}
            onValueChangeHandler={() => {
              handleEndType('until');
              bottomSheetModalRef.current?.present();
            }}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">종료 날짜 설정</Text>
        </View>

        {repeat_mode === 'until' && (
          <Text className="text-gray-300 ml-12 mt-1">
            {repeat_until_date ? `선택한 종료일: ${repeat_until_date}` : '종료일을 선택하세요'}
          </Text>
        )}
      </View>
    </View>
  );
}
