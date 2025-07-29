import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View,
} from 'react-native';

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  value: string | null;
  onChange: (value: string) => void;
}

export default function CustomDropdown({
  data,
  placeholder = '선택하세요',
  value,
  onChange,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = data.find((d) => d.value === value)?.label;

  return (
    <View className="w-[150px] relative">
      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between w-[150px] h-[36px] px-2 py-1 border border-gray-300 rounded-[10px]"
      >
        <Text className={`text-sm ${value ? 'text-light' : 'text-gray-300'}`}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#979B9F"
        />
      </Pressable>

      {open && (
        <View className="mt-2 bg-gray-200 rounded-[12px] py-1" style={{ maxHeight: 200, position: 'absolute', zIndex: 9999, top: 36, left: 0 , right:0}}>
          <ScrollView>
            {data.map((item) => {
              const isSelected = item.value === value;
              return (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`${
                    isSelected ? 'bg-blue' : 'bg-transparent'
                  } px-2 py-1 rounded-[8px] mx-1 my-1`}
                >
                  <Text
                    className={`text-sm ${
                      isSelected ? 'text-white' : 'text-black'
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
