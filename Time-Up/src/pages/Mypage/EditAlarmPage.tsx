import { getAlarmList, getAutoAlarm, getAutoAlarmCheckTime, putAutoAlarmCheckTime, updateAutoAlarm } from '@/src/apis/users';
import { alarmSoundOptions, intervalOptions, remindSoundOptions, remindVibrationOptions, repeatCountOptions, vibrationTypeOptions } from '@/src/constants/userOptions';
import { loadRemindSettings, saveRemindSettings } from '@/src/utils/remindStorage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import DropDown3 from '../../components/common/DropDown3';
import TimeModal from '../../components/Onboarding/TimeModal';

export default function EditrAlarmPage() {
  const [remindSound, setRemindSound] = useState<string | null>(null);
  const [remindVibration, setRemindVibration] = useState<string | null>(null);
  const [alarmSound, setAlarmSound] = useState<string | null>(null);
  const [vibrationType, setVibrationType] = useState<string | null>(null);
  const [interval, setInterval] = useState<string | null>(null);
  const [repeatCount, setRepeatCount] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [isOptional, setIsOptional] = useState(false);
  const [alarmTime, setAlarmTime] = useState<{ hour: string; minute: string } | null>(null);

  const [autoAlarmId, setAutoAlarmId] = useState<number | null>(null);

  const handleSelect = (hour: string, minute: string) => {
    setAlarmTime({ hour, minute });
    setOpen(false);
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      const remindSettings = await loadRemindSettings();
      if (remindSettings) {
        setRemindSound(remindSettings.sound);
        setRemindVibration(remindSettings.vibration);
      }
      try {
        const response = await getAutoAlarmCheckTime();
        const timeStr = response?.alarm_check_time;
        if (timeStr) {
          const date = new Date(timeStr);
          const hour = date.getUTCHours().toString().padStart(2, '0');
          const minute = date.getUTCMinutes().toString().padStart(2, '0');
          setAlarmTime({ hour, minute });
        }

        const alarmList = await getAlarmList();
        if (alarmList?.auto_alarms?.length > 0) {
          const id = alarmList.auto_alarms[0].auto_alarm_id;
          setAutoAlarmId(id);

          const alarmDetail = await getAutoAlarm(id);
          setAlarmSound(alarmDetail.is_sound ? 'defaultSound' : 'no'); 
          setVibrationType(alarmDetail.is_vibrating ? alarmDetail.vibration_type : 'no');
          setInterval(alarmDetail.repeat_interval?.toString() ?? '0');
          setRepeatCount(alarmDetail.repeat_count?.toString() ?? '0');
        } else {
          console.warn('자동 알람이 없습니다.');
        }
      } catch (error) {
        console.error('알람 데이터 불러오기 실패:', error);
      }
    };
    fetchAndSetData();
  }, []);

  const handleSave = async () => {
    if (!alarmTime) {
      Alert.alert('시간을 설정해주세요.');
      return;
    }
    if (!autoAlarmId) {
      Alert.alert('자동 알람 ID를 불러오지 못했습니다.');
      return;
    }

    try {
      await saveRemindSettings({ sound: remindSound, vibration: remindVibration });
      const timePayload = {
        alarm_check_time: new Date(
          Date.UTC(1970, 0, 1, Number(alarmTime.hour), Number(alarmTime.minute), 0)
        ).toISOString(),
      };
      await putAutoAlarmCheckTime(timePayload);

      const alarmPayload = {
        is_repeating: interval !== '0',
        is_sound: alarmSound !== 'no',
        is_vibrating: vibrationType !== 'no',
        vibration_type: vibrationType || 'default',
        sound_id: alarmSound === 'no' ? null : 2,
        repeat_interval: Number(interval) || 0,
        repeat_count: Number(repeatCount) || 0,
      };
      await updateAutoAlarm(autoAlarmId, alarmPayload);

      Alert.alert('저장 완료', '설정이 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      Alert.alert('저장 실패', '다시 시도해주세요.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-black px-4 py-4">
      <BeforeHeader title="리마인드 / 알람" rightLabel="저장" onRightPress={handleSave} />
      <View className="bg-gray-900 rounded-lg px-2 py-3 mb-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-base">리마인드 알람 설정</Text>
          <View className="w-1/2">
            <DropDown3 data={remindSoundOptions} value={remindSound} onChange={setRemindSound} placeholder="알림음 선택" />
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-white"></Text>
          <View className="w-1/2">
            <DropDown3 data={remindVibrationOptions} value={remindVibration} onChange={setRemindVibration} placeholder="진동 유형 선택" />
          </View>
        </View>
      </View>

      <View className="bg-gray-900 rounded-lg px-2 py-3 mb-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-base">자동 알람 설정</Text>
          <View className="w-1/2">
            <DropDown3 data={alarmSoundOptions} value={alarmSound} onChange={setAlarmSound} placeholder="알람음 선택" />
          </View>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white"></Text>
          <View className="w-1/2">
            <DropDown3 data={vibrationTypeOptions} value={vibrationType} onChange={setVibrationType} placeholder="진동 유형 선택" />
          </View>
        </View>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white"></Text>
          <View className="w-1/2">
            <DropDown3 data={intervalOptions} value={interval} onChange={setInterval} placeholder="반복 간격 선택" />
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-white"></Text>
          <View className="w-1/2">
            <DropDown3 data={repeatCountOptions} value={repeatCount} onChange={setRepeatCount} placeholder="반복 횟수 선택" />
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-gray-900 rounded-lg px-2 py-3 mb-2"
        onPress={() => { setOpen(true); setIsOptional(true); }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-base">자동 알람 확인 시간</Text>
          <Text className="text-light">
            {alarmTime ? (() => {
              const hour24 = Number(alarmTime.hour);
              const minute = alarmTime.minute;
              const isAM = hour24 < 12;
              const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
              const ampm = isAM ? '오전' : '오후';
              return `${ampm} ${hour12.toString().padStart(2, '0')} : ${minute}`;
            })() : '입력'}
          </Text>
        </View>
      </TouchableOpacity>
      {open && (
        <TimeModal
          visible={open}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          choice={isOptional ? 'optional' : undefined}
        />
      )}
    </ScrollView>
  );
}
