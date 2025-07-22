import React from 'react';
import { TouchableOpacity } from 'react-native';
import BeforeArrowIcon from '../../../assets/images/BeforeArrowIcon.svg';

interface BeforeButtonProps {
  onPress: () => void;
}

export default function BeforeButton({
  onPress,
}: BeforeButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`
        w-[72px] h-[48px] rounded-2xl flex-row items-center justify-center py-3 border border-white`}>
      <BeforeArrowIcon/>
    </TouchableOpacity>
  );
}
