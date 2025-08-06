// src/components/alarm/AlarmButton.tsx
import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';

interface AlarmButtonProps {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function AlarmButton({
  title,
  backgroundColor = 'light-button',
  textColor = 'black',
  onPress,
  style = {},
}: AlarmButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor,
          borderRadius: 9999,
          paddingHorizontal: 24,
          paddingVertical: 10,
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color: textColor, fontSize: 20, fontWeight: '500' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
