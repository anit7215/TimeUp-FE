import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface NextButtonProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
}

export default function NextButton({
  title = '다음',
  onPress,
  disabled = false,
}: NextButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={`
        w-full h-[50px] rounded-[20px] items-center justify-center py-3
        ${disabled ? 'bg-light' : 'bg-blue'}
      `}
    >
      <Text className={`text-sm font-pretendard font-normal text-[18px] leading-[26px] text-black `}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
