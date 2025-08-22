import { getAutoAlarmCheckTime, putAutoAlarmCheckTime } from '@/src/apis/users';
import { alarmSoundOptions, intervalOptions, remindSoundOptions, remindVibrationOptions, repeatCountOptions, vibrationTypeOptions } from '@/src/constants/userOptions';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import { loadAutoAlarmSettings, saveAutoAlarmSettings } from '@/src/utils/autoAlarmStorage';
import { loadRemindSettings, saveRemindSettings } from '@/src/utils/remindStorage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import DropDown3 from '../../components/common/DropDown3';
import DayTimeModal, { TimeModalRef } from '../../components/Onboarding/DayTimeModal';

export default function EditrAlarmPage() {
  const navigation = useAppNavigation();
  const [remindSound, setRemindSound] = useState<string | null>(null);
  const [remindVibration, setRemindVibration] = useState<string | null>(null);
  const [alarmSound, setAlarmSound] = useState<string | null>(null);
  const [vibrationType, setVibrationType] = useState<string | null>(null);
  const [interval, setInterval] = useState<string | null>(null);
  const [repeatCount, setRepeatCount] = useState<string | null>(null);

  const [alarmTime, setAlarmTime] = useState<{ hour: string; minute: string, period: string } | null>(null);
  const timeModalRef = useRef<TimeModalRef>(null);

  const handleSelect = (hour: string, minute: string, period: string) => setAlarmTime({ hour, minute, period });
  const handleOpenTimeModal = useCallback(() => timeModalRef.current?.present(), []);

  useEffect(() => {
    const fetchData = async () => {
      const remindSettings = await loadRemindSettings();
      setRemindSound(remindSettings?.sound ?? 'basic');
      setRemindVibration(remindSettings?.vibration ?? 'basic');

      const autoAlarmSettings = await loadAutoAlarmSettings();
      setAlarmSound(autoAlarmSettings?.alarmSound ?? 'basic');
      setVibrationType(autoAlarmSettings?.vibrationType ?? 'basic');
      setInterval(autoAlarmSettings?.interval ?? '0');
      setRepeatCount(autoAlarmSettings?.repeatCount ?? '0');

      try {
        const response = await getAutoAlarmCheckTime();
        if (response?.alarm_check_time) {
          const date = new Date(response.alarm_check_time);
          const hour24 = date.getUTCHours();
          const minute = date.getUTCMinutes().toString().padStart(2, '0');
          const period = hour24 >= 12 ? '오후' : '오전';
          let hour12 = hour24 % 12;
          hour12 = hour12 ? hour12 : 12;

          setAlarmTime({
            hour: hour12.toString().padStart(2, '0'),
            minute,
            period,
          });
        } else {
          setAlarmTime({ hour: '08', minute: '00', period: '오전' });
        }
      } catch {
        setAlarmTime({ hour: '08', minute: '00', period: '오전' });
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!alarmTime) {
      Alert.alert('시간을 설정해주세요.');
      return;
    }

    try {
      await saveRemindSettings({ sound: remindSound, vibration: remindVibration });
      await saveAutoAlarmSettings({ alarmSound, vibrationType, interval, repeatCount, alarmTime });
      
      let hour24 = Number(alarmTime.hour);
      if (alarmTime.period === '오후' && hour24 !== 12) {
        hour24 += 12;
      }
      if (alarmTime.period === '오전' && hour24 === 12) {
        hour24 = 0;
      }

      const timePayload = {
        alarm_check_time: new Date(
          Date.UTC(1970, 0, 1, hour24, Number(alarmTime.minute), 0)
        ).toISOString(),
      };
      await putAutoAlarmCheckTime(timePayload);

      Alert.alert('저장 완료', '설정이 저장되었습니다.');
      navigation.navigate('MyPage');
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

      <TouchableOpacity className="bg-gray-900 rounded-lg px-2 py-3 mb-2" onPress={handleOpenTimeModal}>
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-base">자동 알람 확인 시간</Text>
          <Text className="text-light">
            {alarmTime ? `${alarmTime.period} ${alarmTime.hour} : ${alarmTime.minute}` : '입력'}
          </Text>
        </View>
      </TouchableOpacity>
      <DayTimeModal
        ref={timeModalRef}
        onSelect={handleSelect}
        choice={'optional'}/>
    </ScrollView>
  );
}