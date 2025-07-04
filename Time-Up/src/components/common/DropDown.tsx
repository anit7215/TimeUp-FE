'use client';

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

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
    <View className="w-full">
      {/* Dropdown button */}
      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between border border-[#979B9F] rounded-[20px] px-[12px] py-[16px] bg-[#121212] w-full"
      >
        <Text className={`${value ? 'text-white' : 'text-[#979B9F]'} text-[16px] font-pretendard`}>
          {selectedLabel || placeholder}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#979B9F" />
      </Pressable>

      {/* Dropdown list */}
      {open && (
        <View className="relative mt-2">
          {/* Inner shadow box */}
          <View
            className="absolute top-0 left-0 w-full h-full rounded-[20px] overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: 'rgba(151, 155, 159, 0.25)',
              shadowColor: '#979B9F',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
            pointerEvents="none"
          />

          <View className="bg-[#33373B] rounded-[20px] py-2 max-h-[300px] border border-[rgba(151,155,159,0.25)] overflow-hidden">
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <View className="relative">
                    {isSelected && (
                      <View
                        className="absolute top-0 left-0 w-full h-full rounded-[20px] overflow-hidden"
                        style={{
                          borderWidth: 1,
                          borderColor: 'rgba(201, 205, 209, 0.25)',
                          shadowColor: '#C9CDD1',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                        pointerEvents="none"
                      />
                    )}

                    <Pressable
                      onPress={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      className={`px-4 py-3 rounded-[20px] ${
                        isSelected ? 'bg-[#4D4DFF]' : ''
                      }`}
                    >
                      <Text className="text-white text-[16px] font-pretendard">
                        {item.label}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
