import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, Text, View } from 'react-native';

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
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const buttonRef = useRef<View>(null); 

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

  const measureButton = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setOpen(true);
      });
    }
  };

  return (
  <>
    <View className="w-full" ref={buttonRef}>
      <Pressable
        onPress={measureButton} 
        className="flex-row items-center justify-between border border-gray-300 rounded-xl px-2 py-2 w-full"
      >
        <Text className={`${value ? 'text-light' : 'text-[#979B9F]'} text-[16px] font-pretendard`}>
            {selectedLabel || placeholder}
          </Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#979B9F" />
        </Pressable>
      </View>

      {/* 추가: Modal을 사용하여 드롭다운을 완전히 독립적으로 렌더링 */}
      <Modal
        visible={open}
        transparent={true}
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        {/* 투명한 배경 - 터치하면 드롭다운 닫기 */}
        <Pressable 
          className="flex-1" 
          onPress={() => setOpen(false)}
          style={{ backgroundColor: 'transparent' }}
        >
          {/* 드롭다운 메뉴 */}
          <Animated.View
            style={{
              position: 'absolute',
              left: buttonLayout.x,
              top: buttonLayout.y + buttonLayout.height + 8, // 버튼 아래 8px 간격
              width: buttonLayout.width,
              transform: [{ scale }],
              opacity,
            }}
          >
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

            <View className="bg-[#33373B] rounded-[20px] py-2 border border-[rgba(151,155,159,0.25)] overflow-hidden">
              <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: 200 }}
                renderItem={({ item }) => {
                  const isSelected = item.value === value;
                  const isHovered = hovered === item.value;
                  const showHighlight = isSelected || isHovered;

                  return (
                    <View className="relative">
                      {showHighlight && (
                        <View className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden pointer-events-none">
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
        </Pressable>
      </Modal>
    </>
  );
}