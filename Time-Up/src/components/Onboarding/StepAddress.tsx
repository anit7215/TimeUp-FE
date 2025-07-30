import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'OnboardingPage'>;

export default function StepAddress() {
  const navigation = useNavigation<Navigation>();

  return (
    <>
      <Text className="font-pretendard font-medium text-2xl leading-loose text-white mb-8">
        주소를 입력해주세요
      </Text>
      <TouchableOpacity
        className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-800"
        onPress={() => navigation.navigate('AddressSearchPage')}
      >
        <Text className="text-white font-medium text-base leading-normal">집</Text>
        <Text className="text-gray-200 font-normal text-base leading-tight">입력</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="px-4 py-1.5 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-700"
        onPress={() => navigation.navigate('AddressSearchPage')}
      >
        <View className="flex-col">
          <Text className="text-white font-medium text-base leading-noraml">직장/학교까지 이동 시간</Text>
          <Text className="text-gray-200 font-regular text-[10px] leading-3 tracking-tight">*선택 사항</Text>
        </View>
        <Text className="text-gray-100 font-normal text-base leading-tight">입력</Text>
      </TouchableOpacity>
    </>
  );
}
