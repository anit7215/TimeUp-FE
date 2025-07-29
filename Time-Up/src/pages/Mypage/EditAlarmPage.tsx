import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import DropDown3 from '../../components/common/DropDown3';

export default function EditrAlarmPage() {
  const [ringTone, setRingTone] = useState<string | null>(null);
  const [vibration, setVibration] = useState<string | null>(null);
  const [alarmSound, setAlarmSound] = useState<string | null>(null);
  const [backupSound, setBackupSound] = useState<string | null>(null);
  const [interval, setInterval] = useState<string | null>(null);
  const [repeat, setRepeat] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const alarmOptions = [
    { label: 'Ring Tone', value: 'ring' },
    { label: 'Vibration', value: 'vibrate' },
  ];

  const soundOptions = [
    { label: 'Heavy Raindrop', value: 'rain' },
    { label: 'Basic Ring', value: 'basic' },
  ];

  const repeatOptions = [
    { label: '3회', value: '3' },
    { label: '5회', value: '5' },
  ];

  const intervalOptions = [
    { label: '5분', value: '5' },
    { label: '10분', value: '10' },
    { label: '30분', value: '30' },
  ];

  return (
    <ScrollView className="flex-1 bg-black px-4 py-4">
      <BeforeHeader title="리마인드 / 알람" rightLabel="저장" onRightPress={() => alert('저장됨')} />
        <View className="bg-gray-800 rounded-2xl p-4 mb-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white">리마인드 알람 설정</Text>
            <View className="w-[150px]">
              <DropDown3
                data={alarmOptions}
                value={ringTone}
                onChange={setRingTone}
                placeholder="알림음 선택"
              />
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-white">진동 설정</Text>
            <View className="w-[150px]">
              <DropDown3
                data={alarmOptions}
                value={vibration}
                onChange={setVibration}
                placeholder="진동 선택"
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-800 rounded-2xl p-4 mb-2">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white">자동 알람 설정</Text>
            <View className="w-[150px]">
              <DropDown3
                data={soundOptions}
                value={alarmSound}
                onChange={setAlarmSound}
                placeholder="자동 알람"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white"></Text>
            <View className="w-[150px]">
              <DropDown3
                data={soundOptions}
                value={backupSound}
                onChange={setBackupSound}
                placeholder="알람"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white"></Text>
            <View className="w-[150px]">
              <DropDown3
                data={intervalOptions}
                value={interval}
                onChange={setInterval}
                placeholder="간격 선택"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-white"></Text>
            <View className="w-[150px]">
              <DropDown3
                data={repeatOptions}
                value={repeat}
                onChange={setRepeat}
                placeholder="반복 횟수 선택"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-gray-800 rounded-2xl px-4 py-4 mb-2"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-white">자동 알람 확인 시간</Text>
            <Text className="text-light">
              오후 10:00
            </Text>
          </View>
        </TouchableOpacity>
    </ScrollView>
  );
}
