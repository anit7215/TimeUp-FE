'use client';

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  Text,
  View
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
  const [hovered, setHovered] = useState<string | null>(null);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const selectedLabel = data.find((d) => d.value === value)?.label;

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const scale = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const opacity = dropdownAnim;

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
        <Animated.View
          className="relative mt-2"
          style={{
            transform: [{ scale }],
            opacity,
          }}
        >
          {/* outer shadow box for the list */}
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
                const isHovered = hovered === item.value;
                const showHighlight = isSelected || isHovered;

                return (
                  <View className="relative">
                    {/* inset shadow + bg for selected or hovered */}
                    {showHighlight && (
                      <View className="absolute top-0 left-0 w-full h-full rounded-[20px] overflow-hidden pointer-events-none">
                        <View
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 20,
                            backgroundColor: '#4D4DFF',
                            boxShadow: 'inset 0px 2px 4px #C9CDD140',
                          }}
                        />
                      </View>
                    )}

                    <Pressable
                      onHoverIn={() => setHovered(item.value)}
                      onHoverOut={() => setHovered(null)}
                      onPress={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      className="px-4 py-3 rounded-[20px] z-10"
                    >
                      <Text
                        className={`text-[16px] font-pretendard z-20 ${
                          showHighlight ? 'text-white' : 'text-[#FFFFFF]'
                        }`}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
