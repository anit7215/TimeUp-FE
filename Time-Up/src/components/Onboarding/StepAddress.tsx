import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../types/navigation';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'OnboardingPage'>;

export default function StepAddress() {
  const navigation = useNavigation<Navigation>();

  return (
    <>
      <Text className="font-pretendard font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white mb-9">
        주소를 입력해주세요
      </Text>
      <TouchableOpacity
        className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-700"
        onPress={() => navigation.navigate('AddressSearchPage')}
      >
        <Text className="text-white font-medium text-base">집</Text>
        <Text className="text-gray font-normal text-base">선택</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-700"
        onPress={() => navigation.navigate('AddressSearchPage')}
      >
        <Text className="text-white font-medium text-base">직장/학교</Text>
        <Text className="text-gray font-normal text-base">선택</Text>
      </TouchableOpacity>
    </>
  );
}
