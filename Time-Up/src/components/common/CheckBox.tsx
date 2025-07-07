import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CheckBoxProps {
  isChecked: boolean;
  disabled?: boolean;
  onValueChangeHandler: (checked: boolean) => void;
  children?: React.ReactNode;
}

export default function CheckBox({
  isChecked,
  disabled = false,
  onValueChangeHandler,
  children,
}: CheckBoxProps) {
  const handlePress = () => {
    if (!disabled) {
      onValueChangeHandler(!isChecked);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`flex-row items-center space-x-2 ${disabled ? 'opacity-40' : 'opacity-100'}`}
      activeOpacity={0.8}
    >
      {/* 바깥 원형 테두리 */} 
      <View
        className={`w-[20px] h-[20px] rounded-full border-[1px] border-white items-center justify-center`}
      >
        {/* 안쪽 파란 동그라미 */}
        {isChecked && <View className="w-[12px] h-[12px] rounded-full bg-blue" />}
      </View>

      {/* 오른쪽 텍스트 */}
      {children && <Text className="text-base">{children}</Text>}
    </TouchableOpacity>
  );
}
