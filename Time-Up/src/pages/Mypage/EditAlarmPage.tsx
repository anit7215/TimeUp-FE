import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

  const remindSoundOptions = [
    { label: '알림음 없음', value: 'no' },
    { label: 'Ring Tone', value: 'ring' },
    { label: 'Basic', value: 'vibrate' },
    { label: 'Basic', value: 'vibrate' },
    { label: 'Basic', value: 'vibrate' },
    { label: 'Basic', value: 'vibrate' },
  ];

    const remindVibrationOptions = [
    { label: '진동 없음', value: 'alarm' },
    { label: 'Ring Tone', value: 'ring' },
    { label: 'Basic', value: 'vibrate' },
    { label: 'Basic', value: 'vibrate' },
    { label: 'Basic', value: 'vibrate' },
    { label: 'Basic', value: 'vibrate' },
  ];


  const alarmSoundOptions = [
    { label: '알림음 없음', value: 'no' },
    { label: 'Heavy Raindrop', value: 'rain' },
    { label: 'Heavy Raindrop', value: 'rain' },
    { label: 'Heavy Raindrop', value: 'rain' },
    { label: 'Heavy Raindrop', value: 'rain' },
  ];

  const vibrationTypeOptions = [
    { label: '진동없음', value: 'no' },
    { label: 'Basic Ring', value: 'basic' },
    { label: 'Basic Ring', value: 'basic' },
    { label: 'Basic Ring', value: 'basic' },
    { label: 'Basic Ring', value: 'basic' },
  ];

  const intervalOptions = [
    { label: '반복없음', value:'0'},
    { label: '5분', value: '5' },
    { label: '10분', value: '10' },
    { label: '30분', value: '30' },
  ];

  const repeatCountOptions = [
    { label: '반복없음', value: '0'},
    { label: '3회', value: '3' },
    { label: '5회', value: '5' },
  ];

  const handleSelect = (hour: string, minute: string) => {
    setAlarmTime({ hour, minute });
    setOpen(false); 
  };

  return (
    <ScrollView className="flex-1 bg-black px-4 py-4">
      <BeforeHeader title="리마인드 / 알람" rightLabel="저장" onRightPress={() => alert('저장됨')} />
        <View className="bg-gray-900 rounded-lg px-2 py-3 mb-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-base font-normal leading-tight font-pretendard">리마인드 알람 설정</Text>
            <View className="w-1/2">
              <DropDown3
                data={remindSoundOptions}
                value={remindSound}
                onChange={setRemindSound}
                placeholder="알림음 선택"
              />
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-white"></Text>
            <View className="w-1/2">
              <DropDown3
                data={remindVibrationOptions}
                value={remindVibration}
                onChange={setRemindVibration}
                placeholder="진동 유형 선택"
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 rounded-lg px-2 py-3 mb-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-base font-normal leading-tight font-pretendard">자동 알람 설정</Text>
            <View className="w-1/2">
              <DropDown3
                data={alarmSoundOptions}
                value={alarmSound}
                onChange={setAlarmSound}
                placeholder="알람음 선택"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white"></Text>
            <View className="w-1/2">
              <DropDown3
                data={vibrationTypeOptions}
                value={vibrationType}
                onChange={setVibrationType}
                placeholder="진동 유형 선택"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white"></Text>
            <View className="w-1/2">
              <DropDown3
                data={intervalOptions}
                value={interval}
                onChange={setInterval}
                placeholder="반복 간격 선택"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-white"></Text>
            <View className="w-1/2">
              <DropDown3
                data={repeatCountOptions}
                value={repeatCount}
                onChange={setRepeatCount}
                placeholder="반복 횟수 선택"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-gray-900 rounded-lg px-2 py-3 mb-2"
          onPress={() => { setOpen(true); setIsOptional(true);}}
        >
          <View className="flex-row justify-between items-center">
            <Text className="font-pretendard text-white text-base font-normal leading-tight font-pretendard">자동 알람 확인 시간</Text>
            <Text className="text-light">
              {alarmTime ? `${alarmTime.hour}:${alarmTime.minute}` : '입력'}
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
