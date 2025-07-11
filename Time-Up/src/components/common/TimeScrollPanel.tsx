// src/components/TimeScrollPanel.tsx
import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ITEM_HEIGHT = 40;

const generateRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => String(i).padStart(2, '0'));

const hours = generateRange(0, 23);
const minutes = generateRange(0, 59);

export default function TimeScrollPanel() {
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const hourRef = useRef<FlatList<string> | null>(null);
  const minuteRef = useRef<FlatList<string> | null>(null);

  const onScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    items: string[],
    onSelect: (val: string) => void
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    onSelect(items[index]);
  };

  const renderItem = (item: string, selected: string) => (
    <View className="h-[40px] items-center justify-center">
      <Text className={`${item === selected ? 'text-3xl text-white font-bold' : 'text-2xl text-gray-300'}`}>
        {item}
      </Text>
    </View>
  );

  const decrease = (value: string, max: number) => {
    const num = (parseInt(value) + 1) % (max + 1);
    return String(num).padStart(2, '0');
  };

  const increase = (value: string, max: number) => {
    const num = (parseInt(value) - 1 + (max + 1)) % (max + 1);
    return String(num).padStart(2, '0');
  };

const renderControlList = (
  label: string[],
  selected: string,
  setSelected: (val: string) => void,
  max: number,
  ref?: React.RefObject<FlatList<string> | null>
) => {
  const scrollToValue = (value: string) => {
    const index = parseInt(value, 10);
    ref?.current?.scrollToOffset({
      offset: ITEM_HEIGHT * index,
      animated: true,
    });
  };

  const handleIncrease = () => {
    const nextValue = increase(selected, max);
    setSelected(nextValue);
    scrollToValue(nextValue);
  };

  const handleDecrease = () => {
    const nextValue = decrease(selected, max);
    setSelected(nextValue);
    scrollToValue(nextValue);
  };

  return (
    <View className="items-center">
      {Platform.OS === 'web' && (
        <TouchableOpacity onPress={handleIncrease}>
          <Text className="text-white text-lg">▲</Text>
        </TouchableOpacity>
      )}

      {Platform.OS === 'web' ? (
        <FlatList
          ref={ref}
          data={label}
          keyExtractor={(item) => item}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          contentContainerStyle={{ paddingVertical: 80 }}
          style={{ height: ITEM_HEIGHT * 5 }}
          onMomentumScrollEnd={(e) => onScrollEnd(e, label, setSelected)}
          renderItem={({ item }) => renderItem(item, selected)}
          extraData={selected}
        />
      ) : (
        <View style={{ height: ITEM_HEIGHT * 5, overflow: 'hidden' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={{ paddingVertical: 80 }}
            onMomentumScrollEnd={(e) => onScrollEnd(e, label, setSelected)}
          >
            {label.map((item, index) => (
              <View key={index} className="h-[40px] items-center justify-center">
                <Text className={`${item === selected ? 'text-3xl text-white font-bold' : 'text-2xl text-gray-300'}`}>
                  {item}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {Platform.OS === 'web' && (
        <TouchableOpacity onPress={handleDecrease}>
          <Text className="text-white text-lg">▼</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

  return (
    <View className="flex-row items-center justify-center bg-transparent w-[160px] h-[260px]">
      <View className="flex-1 items-center">
        {renderControlList(hours, selectedHour, setSelectedHour, 23, hourRef)}
      </View>
      <Text className="text-xl font-bold text-white px-2">:</Text>
      <View className="flex-1 items-center">
        {renderControlList(minutes, selectedMinute, setSelectedMinute, 59, minuteRef)}
      </View>
    </View>
  );
}