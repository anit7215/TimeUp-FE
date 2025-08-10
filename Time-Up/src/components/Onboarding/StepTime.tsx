import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import TimeModal from './TimeModal';
import { formatTime } from '@/src/utils/userTimeFormat';

type StepTimeProps = {
  readyTime: { hour: string; minute: string } | null;
  setReadyTime: (time: { hour: string; minute: string } | null) => void;
  commuteTime: { hour: string; minute: string } | null;
  setCommuteTime: (time: { hour: string; minute: string } | null) => void;
};

export default function StepTime({ readyTime, setReadyTime, commuteTime, setCommuteTime }: StepTimeProps) {
  const [open, setOpen] = useState(false);
  const [isOptional, setIsOptional] = useState(false);

  const handleSelect = (hour: string, minute: string) => {
    const newTime = { hour, minute };
    if (isOptional) {
      setCommuteTime(newTime);
    } else {
      setReadyTime(newTime);
    }
    setOpen(false);
  };

  return (
    <>
      <Text className="font-pretendard font-medium text-2xl leading-loose text-white mb-8">
        준비 및 이동 시간을 입력해주세요
      </Text>
      <TouchableOpacity className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-800" onPress={() => {
        setOpen(true);
        setIsOptional(false);}}>
        <Text className="text-white font-medium text-base leading-normal">외출 준비 시간</Text>
        <Text className="text-gray-100 font-normal text-base leading-tight">{formatTime(readyTime)}</Text>
      </TouchableOpacity>
      <TouchableOpacity className="px-4 py-1.5 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-800" onPress={() => { setOpen(true);
      setIsOptional(true);}}>
        <View className="flex-col">
          <Text className="text-white font-medium text-base leading-normal">직장/학교까지 이동 시간</Text>
          <Text className="text-gray-200 font-normal leading-3 tracking-tight text-[10px]">*선택 사항</Text>
        </View>
        
        <Text className="text-gray-100 font-normal text-base leading-tight">{formatTime(commuteTime)}</Text>
      </TouchableOpacity>
      {open && (
        <TimeModal
          visible={open}
          onClose={() => setOpen(false)}
          onSelect={handleSelect}
          choice={isOptional ? 'optional' : undefined}
        />
      )}
    </>
  );
}
