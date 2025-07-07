import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


export default function OnBoardingPage() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl text-blue-600 font-bold">온보딩</Text>
      <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded"
        onPress={() => navigation.navigate('LoginPage')}>
        <Text className="text-white">로그인</Text>
      </TouchableOpacity>
    </View>
  );
}
