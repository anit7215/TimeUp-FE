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
        w-full h-[50px] rounded-3xl items-center justify-center py-3
        ${disabled ? 'bg-gray-700' : 'bg-light'}
      `}
    >
      <Text className={`text-lg font-pretendard font-medium text-lg leading-relaxed text-black `}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
