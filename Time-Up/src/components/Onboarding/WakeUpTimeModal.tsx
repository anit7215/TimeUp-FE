import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import HalfTimeScrollPanel from '../common/HalfTimeScrollPanel';

interface WakeUpTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (hour: string, minute: string, period: string, selectedDays: string[]) => void;
  initialSelectedDays: string[];
}

const days = ['일', '월', '화', '수', '목', '금', '토'];

export default function WakeUpTimeModal({ visible, onClose, onSelect, initialSelectedDays }: WakeUpTimeModalProps) {
  const [selectedTime, setSelectedTime] = useState({ hour: '00', minute: '00', period: '오전' });
  const [selectedDays, setSelectedDays] = useState<string[]>(initialSelectedDays);
  useEffect(() => {
  setSelectedDays(initialSelectedDays);
}, [initialSelectedDays]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (hour: string, minute: string, period: string) => {
    setSelectedTime({ hour, minute, period });
  };

  const handleSelect = () => {
    onSelect(selectedTime.hour, selectedTime.minute, selectedTime.period, selectedDays);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="px-4 pt-9 pb-12 rounded-t-[32px] flex-col justify-end items-center bg-gray-800"
          onPress={() => {}}
        >
          <HalfTimeScrollPanel onTimeChange={handleTimeChange} />

          <View className="flex-row justify-between w-full px-9 mt-9">
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                className={`px-3 py-1 rounded-full ${
                  selectedDays.includes(day) ? 'bg-blue' : 'bg-transparent'
                }`}
                onPress={() => toggleDay(day)}
              >
                <Text
                  className={`text-lg text-white font-normal`}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row justify-between gap-6 items-center w-full px-6 mt-16">
            <TouchableOpacity
              onPress={onClose}
              className="px-[46px] py-2 rounded-[20px] justify-center items-center bg-gray-750"
            >
              <Text className="text-gray-100 text-base font-medium leading-normal">취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSelect}
              className="px-[46px] py-2 rounded-[20px] justify-center items-center bg-light"
              disabled={selectedDays.length === 0}
            >
              <Text className="text-black text-base font-medium leading-normal">선택</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
