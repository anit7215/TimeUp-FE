import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import CheckBox from '../../components/common/CheckBox';
import BeforeHeader from '@/src/components/common/BeforeHeader';
import { useNavigation } from '@react-navigation/native';
import { useSchedule } from '@/src/context/ScheduleContext';

export default function SetRemindAlarmPage() {
  const navigation = useNavigation();
  const { state, dispatch } = useSchedule();
  const form = state.draft;

  const [alarmOn, setAlarmOn] = useState(form.is_reminding ?? false);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    form.remind_at ?? null
  );

  const remindOptions: { label: string; minutes: number }[] = [
    { label: '일정 시작 시간', minutes: 0 },
    { label: '5분 전', minutes: 5 },
    { label: '10분 전', minutes: 10 },
    { label: '30분 전', minutes: 30 },
    { label: '1시간 전', minutes: 60 },
    { label: '1일 전', minutes: 1440 },
  ];

  const handleToggleSwitch = useCallback(() => {
    setAlarmOn(prev => {
      const next = !prev;
      if (!next) setSelectedOption(null);
      return next;
    });
  }, []);

  const saveReminder = () => {
    dispatch({
      type: 'UPDATE_DRAFT',
      payload: {
        is_reminding: alarmOn,
        remind_at: alarmOn && selectedOption !== null ? selectedOption : null,
      },
    });
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-black pt-5 px-7">
      <BeforeHeader rightLabel="확인" onRightPress={saveReminder} />

      {/* 토글 스위치 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,marginBottom: 13  }}>
        <Text style={{ color: 'white', fontSize: 20}}>리마인드 알림</Text>
        <ToggleSwitch isOn={alarmOn} onToggle={handleToggleSwitch} disabled={false} />
      </View>

      {/* 알림 옵션 리스트 */}
      <View style={{ paddingLeft: 20 }}>
        {remindOptions.map(({ label, minutes }) => {
          const isSelected = selectedOption === minutes;
          return (
            <TouchableOpacity
              key={minutes}
              onPress={() => alarmOn && setSelectedOption(minutes)}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}
            >
              <CheckBox
                isChecked={isSelected}
                onValueChangeHandler={() => alarmOn && setSelectedOption(minutes)}
                disabled={!alarmOn}
              />
              <Text style={{ color: 'white', fontSize: 16, marginLeft: 12 }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
