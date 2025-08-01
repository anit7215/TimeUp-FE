import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import WakeUpTimeModal from './WakeUpTimeModal';

const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

type TimeData = { period: string; hour: string; minute: string };

type StepWakeUpProps = {
  selectedTimes: Record<string, TimeData>;
  setSelectedTimes: React.Dispatch<React.SetStateAction<Record<string, TimeData>>>;
};

export default function StepWakeUp({ selectedTimes, setSelectedTimes }: StepWakeUpProps) {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const handleSelect = (hour: string, minute: string, period: string, selectedDays: string[]) => {
    const timeData = { hour, minute, period };
    setSelectedTimes((prev) => {
      const updated = { ...prev };
      selectedDays.forEach((day) => {
        const fullDay =
          day === '일' ? '일요일' :
          day === '월' ? '월요일' :
          day === '화' ? '화요일' :
          day === '수' ? '수요일' :
          day === '목' ? '목요일' :
          day === '금' ? '금요일' :
          '토요일';
        updated[fullDay] = timeData;
      });
      return updated;
    });
  };
  const convertToShortDay = (day: string): string => {
  return day.slice(0, 1); 
};

  return (
    <>
      <Text className="font-pretendard font-medium text-2xl leading-loose text-white mb-8">
        기상 시간을 입력해주세요
      </Text>
      {days.map((day) => (
        <TouchableOpacity
          key={day}
          className="px-12 py-3 mb-3 rounded-[20px] flex-row justify-between items-center bg-gray-800"
          onPress={() => {
            setSelectedDay(day);
            setOpen(true);
          }}
        >
          <Text className="text-white font-normal text-base leading-tight">{day}</Text>
          <Text className="text-white font-normal text-base">|</Text>
          <View className="gap-2 flex-row items-center">
            {selectedTimes[day] ? (
              <>
                <Text className="text-white font-normal text-base leading-tight">
                  {selectedTimes[day].period}
                </Text>
                <Text className="text-white font-normal text-base leading-tight">
                  {selectedTimes[day].hour}:{selectedTimes[day].minute}
                </Text>
              </>
            ) : (
              <Text className="text-white font-normal text-base leading-tight">입력</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}

      {open && (
        <WakeUpTimeModal
          visible={open}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          initialSelectedDays={selectedDay ? [convertToShortDay(selectedDay)] : []}
        />
      )}
    </>
  );
}
