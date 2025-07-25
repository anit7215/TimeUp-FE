// src/components/HalfTimeScrollPanel.tsx
import React, { useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, TouchableOpacity, View, } from 'react-native';

const ITEM_HEIGHT = 40;

const generateRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => String(i + start).padStart(2, '0'));

const hours = generateRange(0, 12);
const minutes = generateRange(0, 59);
const periods = Platform.OS === 'web'
  ? ['오전', '오후']
  : [' ', ' ', '오전', '오후', ' ', ' '];

export default function HalfTimeScrollPanel() {
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('오전');

  const hourRef = useRef<FlatList<string> | null>(null);
  const minuteRef = useRef<FlatList<string> | null>(null);
  const periodRef = useRef<FlatList<string> | null>(null);

  const onScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    items: string[],
    onSelect: (val: string) => void,
    ref?: React.RefObject<FlatList<string> | null>,
    listName?: 'periods' | 'hours' | 'minutes'
  ) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (Platform.OS === 'web') {
      if (items[index]) onSelect(items[index]);
    } else {
      if (listName === 'periods') {
        const value = items[index];
        if (value === '오전' || value === '오후') {
          onSelect(value);
        } else {
          const nearestIndex = index < 3 ? 2 : 3;
          const correctedValue = items[nearestIndex];
          onSelect(correctedValue);
          ref?.current?.scrollToOffset({
            offset: ITEM_HEIGHT * nearestIndex,
            animated: true,
          });
        }
      } else {
        if (items[index]) {
          onSelect(items[index]);
        }
      }
    }
  };

  const renderItem = (item: string, selected: string) => (
    <View className="h-[40px] items-center justify-center">
      <Text className={`${item === selected ? 'text-3xl text-white font-bold' : 'text-2xl text-gray-300'}`}>
        {item}
      </Text>
    </View>
  );

  const scrollToValue = (value: string, list: string[], ref: React.RefObject<FlatList<string> | null>) => {
    const index = list.findIndex((v) => v === value);
    if (index !== -1) {
      ref?.current?.scrollToOffset({
        offset: ITEM_HEIGHT * index,
        animated: true,
      });
    }
  };

  const decrease = (value: string, list: string[]) => {
    const index = list.findIndex((v) => v === value);
    const nextIndex = (index + 1) % list.length;
    return list[nextIndex];
  };

  const increase = (value: string, list: string[]) => {
    const index = list.findIndex((v) => v === value);
    const nextIndex = (index - 1 + list.length) % list.length;
    return list[nextIndex];
  };

  const renderControlList = (
    items: string[],
    selected: string,
    setSelected: (val: string) => void,
    ref: React.RefObject<FlatList<string> | null>,
    listName: 'periods' | 'hours' | 'minutes'
    ) => {
      const handleIncrease = () => {
      const next = increase(selected, items);
      setSelected(next);
      scrollToValue(next, items, ref);
    };

    const handleDecrease = () => {
      const next = decrease(selected, items);
      setSelected(next);
      scrollToValue(next, items, ref);
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
            data={items}
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
            onMomentumScrollEnd={(e) => onScrollEnd(e, items, setSelected, ref, listName)}
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
            onMomentumScrollEnd={(e) => onScrollEnd(e, items, setSelected, ref, listName)}
          >
            {items.map((item, index) => (
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
    <View className="flex-row items-center justify-center bg-transparent w-[220px] h-[260px] px-2">
      <View className="w-[70px] items-center">
        {renderControlList(periods, selectedPeriod, setSelectedPeriod, periodRef, 'periods')}
      </View>
      <Text className="text-xl font-bold text-white px-2"> </Text>
      <View className="w-[50px] items-center">
        {renderControlList(hours, selectedHour, setSelectedHour, hourRef, 'hours')}
      </View>
      <Text className="text-xl font-bold text-white px-2">:</Text>
      <View className="w-[50px] items-center">
        {renderControlList(minutes, selectedMinute, setSelectedMinute, minuteRef, 'minutes')}
      </View>
    </View>
  );
}