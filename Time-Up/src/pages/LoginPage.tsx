// src/pages/LoginPage.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginPage() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl text-red-600 font-bold">로그인</Text>
      <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded"
        onPress={() => navigation.navigate('CalendarPage')}>
        <Text className="text-white">로그인 완료 후</Text>
      </TouchableOpacity>      
    </View>
  );
}
