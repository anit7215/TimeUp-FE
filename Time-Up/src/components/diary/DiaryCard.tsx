import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { FC } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { DiaryItem } from '../../types/diary';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACING = (width * 0.3) / 4;
const ITEM_FULL_SIZE = ITEM_WIDTH + SPACING * 2;

interface DiaryCardProps {
  item: DiaryItem;
  index: number;
  scrollX: Animated.Value;
}

const DiaryCard: FC<DiaryCardProps> = ({ item, index, scrollX }) => {
  const navigation = useAppNavigation();
  const inputRange = [
    (index - 1) * ITEM_FULL_SIZE,
    index * ITEM_FULL_SIZE,
    (index + 1) * ITEM_FULL_SIZE,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });
  
  const animatedStyle = {
    transform: [{ scale }],
  };
  const date = new Date(item.diary_date);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  const dynamicContainerStyle = {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
    marginHorizontal: SPACING,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('DiaryDetailPage', { diary: item })}
    >
      <Animated.View
        style={[dynamicContainerStyle, animatedStyle]}
        className="items-center justify-center"
      >
        <View className="w-56 h-80 bg-gray-800 rounded-[20px] p-5">
          <Text className="text-white text-base font-bold mb-[10px]">
            {formattedDate}
          </Text>
          <Text className="text-white text-base font-bold mb-[10px]">
            {item.title}
          </Text>
          <Text className="text-white text-sm" numberOfLines={3}>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default DiaryCard;