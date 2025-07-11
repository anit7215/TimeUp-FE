// src/pages/AlarmPage.tsx
import useAppNavigation from '../hooks/useAppNavigation';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../Layouts/BottomLayout';

export default function AlarmPage() {
  const navigation = useAppNavigation();
  return (
    <BottomLayout>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl text-red-600 font-bold">알람페이지</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded"
          onPress={() => navigation.navigate('TestTimeScrollPage')}>
          <Text className="text-white">TimeScroll Test Page</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded"
          onPress={() => navigation.navigate('TestHalfTimeScrollPage')}>
          <Text className="text-white">HalfTimeScroll Test Page</Text>
        </TouchableOpacity>

      </View>
    </BottomLayout>
  );
}