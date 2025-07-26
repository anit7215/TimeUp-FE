// src/components/alarm/TransparentButton.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface TransparentButtonProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
}

export default function TransparentButton({
  title = '버튼',
  onPress,
  disabled = false,
}: TransparentButtonProps) {
  const width = 128;
  const height = 48;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
      style={{
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 22,
          fontFamily: 'pretendard',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
