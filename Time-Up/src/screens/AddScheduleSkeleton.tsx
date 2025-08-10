// src/screens/skeleton/AddScheduleSkeleton.tsx
import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

export default function AddScheduleSkeleton() {
  return (
    <ScrollView className="flex-1 bg-black px-5 pt-10">
      <SkeletonPlaceholder backgroundColor="#2A2A2A" highlightColor="#3B3B3B">
        <View className="mb-6">
          {/* 일정 이름 */}
          <View className="w-40 h-6 rounded-md" />
        </View>

        {/* 날짜/시간 */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <View className="w-20 h-4 rounded-md mb-2" />
            <View className="w-20 h-8 rounded-md" />
          </View>
          <View className="items-center">
            <View className="w-20 h-4 rounded-md mb-2" />
            <View className="w-20 h-8 rounded-md" />
          </View>
        </View>

        {/* 색상 */}
        <View className="mb-6">
          <View className="w-16 h-4 rounded-md mb-3" />
          <View className="flex-row justify-between">
            {[...Array(7)].map((_, i) => (
              <View
                key={i}
                className="w-6 h-6 rounded-full"
              />
            ))}
          </View>
        </View>

        {/* 리마인드 + 반복 */}
        <View className="flex-row justify-between mb-6">
          <View className="w-[48%] h-20 rounded-2xl" />
          <View className="w-[48%] h-20 rounded-2xl" />
        </View>

        {/* 장소 */}
        <View className="w-full h-20 rounded-2xl mb-6" />

        {/* 메모 */}
        <View className="w-full h-20 rounded-2xl mb-6" />

        {/* 하단 버튼 */}
        <View className="flex-row justify-between mt-6">
          <View className="w-[45%] h-12 rounded-full bg-gray-700" />
          <View className="w-[45%] h-12 rounded-full bg-gray-700" />
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  );
}
