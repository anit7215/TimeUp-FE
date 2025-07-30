import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  selected: string[];
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

export default function StepTransport({ selected, options, onSelect }: Props) {
  return (
    <>
      {options.map((opt) => {
        const selectedIndex = selected.indexOf(opt.value);
        const isSelected = selectedIndex !== -1;

        return (
          <TouchableOpacity
            key={opt.value}
            className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center"
            style={{ backgroundColor: isSelected ? '#4D4DFF' : '#33373B' }}
            onPress={() => onSelect(opt.value)}
          >
            <Text className="text-white font-medium text-base leading-normal">{opt.label}</Text>
            {isSelected && (
              <View className="flex items-center justify-center">
                <Text className="text-gray-100 font-normal text-base leading-tight" style={{ flexShrink: 0 }}>
                  {selectedIndex + 1}순위
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );
}
