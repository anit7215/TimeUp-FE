// SetScheduleRepeatPage.tsx
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import BeforeHeader from '../components/common/BeforeHeader';
import CheckBox from '../components/common/CheckBox';
import CustomCalendar from '../components/SetSchedule/CustomCalendar';
import Modal  from '../components/common/Modal';

import { useSchedule } from '../context/ScheduleContext';
import { ensureRecurrenceRule, toggleWeekday } from '../helpers/recurrence';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const toLocalDate = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const nthWeekOfMonth = (date: Date) => Math.floor((date.getDate() - 1) / 7) + 1;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const pad2 = (n: number) => String(n).padStart(2, '0');
// 날짜 비교용: 입력을 'YYYY-MM-DD'로 정규화
const toYMD = (v?: string | null): string | null => {
  if (!v) return null;
  const m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad2(+m[2])}-${pad2(+m[3])}`;
  const d = new Date(v);
  return Number.isFinite(d.getTime())
    ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
    : null;
};

export default function SetScheduleRepeatPage() {
  const navigation = useNavigation();
  const { state, dispatch } = useSchedule();

  // 모달 상태
  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const initialRule = useMemo(
    () => ensureRecurrenceRule(state.draft.recurrence_rule),
    [state.draft.recurrence_rule]
  );

  const start_local = useMemo(
    () => toLocalDate(state.draft.start_date) ?? new Date(),
    [state.draft.start_date]
  );
  const start_day_of_month = start_local.getDate();
  const start_weekday = start_local.getDay();
  const lockedWeekday = start_weekday; // 시작 요일 잠금
  const start_nth = nthWeekOfMonth(start_local);
  const start_weekday_label = DAY_LABELS[start_weekday];

  const [repeat_type, set_repeat_type] = useState<null | 'weekly' | 'monthly'>(initialRule.repeat_type);

  const [repeat_weekdays, set_repeat_weekdays] = useState<number[]>(
    (() => {
      const base =
        initialRule.repeat_weekdays && initialRule.repeat_weekdays.length
          ? initialRule.repeat_weekdays
          : [start_weekday];
      return Array.from(new Set([...base, lockedWeekday])).sort((a, b) => a - b);
    })()
  );

  const [repeat_mode, set_repeat_mode] = useState<'count' | 'until'>(
    initialRule.repeat_mode === 'until' ? 'until' : 'count'
  );

  // 반복 횟수: 최대 100, 빈 입력 시 0으로
  const [repeat_count, set_repeat_count] = useState<number>(() => {
    const n = Number(initialRule.repeat_count ?? 1);
    return Number.isFinite(n) ? clamp(n, 0, 100) : 1;
  });
  const [repeatCountText, setRepeatCountText] = useState<string>(() =>
    String(
      Number.isFinite(initialRule.repeat_count ?? NaN)
        ? clamp(initialRule.repeat_count as number, 0, 100)
        : 1
    )
  );

  const [repeat_until_date, set_repeat_until_date] = useState<string | null>(
    initialRule.repeat_until_date ?? null
  );

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
    initialRule.weekday ?? start_weekday
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

  // start_* 값이 바뀌면 기본값/잠금 보정
  useEffect(() => {
    set_repeat_weekdays(prev => {
      const base =
        initialRule.repeat_weekdays && initialRule.repeat_weekdays.length
          ? prev
          : [start_weekday];
      const withLock = Array.from(new Set([...(base ?? []), lockedWeekday]));
      return withLock.sort((a, b) => a - b);
    });
    set_day_of_month(prev => (initialRule.day_of_month != null ? prev : start_day_of_month));
    set_nth_week(prev => (initialRule.nth_week != null ? prev : start_nth));
    set_weekday(prev => (initialRule.weekday != null ? prev : start_weekday));
  }, [start_weekday, start_day_of_month, start_nth]);

  // 모드 전환시 카운트 표시 문자열 동기화
  useEffect(() => {
    if (repeat_mode === 'count') {
      setRepeatCountText(String(clamp(repeat_count || 0, 0, 100)));
    }
  }, [repeat_mode]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  const onToggleWeeklyDay = (day_index: number) => {
    set_repeat_type('weekly');
    set_repeat_weekdays(prev => {
      // 잠금 요일은 토글 불가
      if (day_index === lockedWeekday) return prev;
      const base = prev && prev.length ? prev : [lockedWeekday];
      const next = toggleWeekday(base, day_index);
      if (!next.includes(lockedWeekday)) next.push(lockedWeekday);
      return next.sort((a, b) => a - b);
    });
  };

  const handleEndType = (mode: 'count' | 'until') => {
    set_repeat_mode(mode);
    if (mode === 'count') set_repeat_until_date(null);
  };

  const handleNumChange = (v: string) => {
    // 숫자만 추출
    const digits = v.replace(/\D+/g, '');
    // 타이핑 중엔 빈 문자열 허용 → 값은 0으로
    if (digits === '') {
      setRepeatCountText('');
      set_repeat_count(0);
      return;
    }
    let n = Number(digits);
    if (!Number.isFinite(n)) n = 0;
    n = clamp(n, 0, 100); // 0~100 제한
    setRepeatCountText(String(n));
    set_repeat_count(n);
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
            weekday: null,
            repeat_mode: 'count',
            repeat_count: null,
            repeat_until_date: null,
          },
        },
      });
      navigation.goBack();
      return;
    }

    // 종료 날짜 유효성 검사 (until 모드일 때)
    if (repeat_mode === 'until') {
      if (!repeat_until_date) {
        setModalMessage('종료 날짜를 선택하세요.');
        setOpen(true);
        return;
      }
      const startYMD = toYMD(state.draft.start_date);
      const untilYMD = toYMD(repeat_until_date);
      // "앞이면" (strictly earlier) 저장 차단
      if (startYMD && untilYMD && untilYMD < startYMD) {
        setModalMessage(`종료 날짜가 시작 날짜(${startYMD})보다 빠릅니다.\n종료 날짜를 다시 선택해 주세요.`);
        setOpen(true);
        return;
      }
    }

    // 저장 직전 보정: 잠금 요일 포함 + 횟수 0~100
    const weekSafe =
      repeat_type === 'weekly'
        ? Array.from(new Set([...(repeat_weekdays ?? []), lockedWeekday])).sort((a, b) => a - b)
        : [];
    const countSafe = repeat_mode === 'count' ? clamp(Number(repeat_count) || 0, 0, 100) : null;

    const nextRule = ensureRecurrenceRule({
      repeat_type,
      repeat_weekdays: weekSafe,
      monthly_option: repeat_type === 'monthly' ? monthly_option ?? null : null,
      day_of_month: repeat_type === 'monthly' && monthly_option === 'day_of_month' ? day_of_month ?? null : null,
      nth_week: repeat_type === 'monthly' && monthly_option === 'nth_weekday' ? nth_week ?? null : null,
      weekday:
        repeat_type === 'monthly' && monthly_option === 'nth_weekday' && weekday != null
          ? weekday
          : null,
      repeat_mode,
      repeat_count: countSafe,
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
            onValueChangeHandler={() => {
              set_repeat_type(prev => {
                const next = prev === 'weekly' ? null : 'weekly';
                if (next === 'weekly') {
                  // 진입 시에도 잠금 포함
                  set_repeat_weekdays(prevDays =>
                    Array.from(new Set([...(prevDays ?? []), lockedWeekday])).sort((a, b) => a - b)
                  );
                }
                return next;
              });
            }}
            disabled={false}
          />
          <Text className="text-white text-[20px] ml-2 p-3">1주마다</Text>
        </View>

        {repeat_type === 'weekly' && (
          <View className="flex-row items-center justify-center mb-2">
            {DAY_LABELS.map((label, idx) => {
              const isSelected = repeat_weekdays.includes(idx);
              const isLocked = idx === lockedWeekday;
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => !isLocked && onToggleWeeklyDay(idx)}
                  disabled={isLocked}
                  className={`w-8 h-8 mx-1 rounded-full items-center justify-center border ${
                    isSelected ? 'border-white' : 'border-0'
                  } ${isLocked ? 'opacity-60' : ''}`}
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
              className={`bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center ${
                is_day_of_month_selected ? 'opacity-100' : 'opacity-80'
              }`}
            >
              <Text className="text-white text-[18px]">
                {start_day_of_month}일마다 반복
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickMonthlyByStartNthWeekday}
              className={`bg-[#33373B] w-[300px] rounded-[24px] m-2 px-4 py-[8px] items-center justify-center ${
                is_nth_weekday_selected ? 'opacity-100' : 'opacity-80'
              }`}
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
              value={repeatCountText}
              onChangeText={handleNumChange}
              onBlur={() => {
                if (repeatCountText === '') {
                  setRepeatCountText('0');
                  set_repeat_count(0);
                } else {
                  const n = clamp(Number(repeatCountText) || 0, 0, 100);
                  setRepeatCountText(String(n));
                  set_repeat_count(n);
                }
              }}
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
            {repeat_until_date ? `선택한 종료일: ${toYMD(repeat_until_date)}` : '종료일을 선택하세요'}
          </Text>
        )}
      </View>

      {/* 공통 모달 */}
      {open && (
        <Modal onClose={() => setOpen(false)} onConfirm={() => setOpen(false)}>
          {modalMessage}
        </Modal>
      )}
    </View>
  );
}
