import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import NextArrowIcon from '../../../assets/images/NextArrowIcon.svg';

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
        w-[215px] h-[48px] rounded-2xl flex-row items-center justify-center py-3
        ${disabled ? 'border border-white' : 'border border-[#B2B2FF]'}
      `}
    >
      <Text className={`text-sm font-pretendard font-normal text-[18px] leading-[24px] text-white`}>
        {title}
      </Text>
      <NextArrowIcon width={24} height={24} className="ml-6" />
    </TouchableOpacity>
  );
}
