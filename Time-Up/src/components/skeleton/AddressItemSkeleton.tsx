import React from 'react';
import { View } from 'react-native';

export default function AddressItemSkeleton() {
  return (
    <View className="px-4 py-3 bg-gray-800 border-b border-black rounded-[20px]">
      <View className="h-4 w-1/2 bg-gray-700 rounded mb-2" />
      <View className="h-3 w-3/4 bg-gray-600 rounded" />
    </View>
  );
}
