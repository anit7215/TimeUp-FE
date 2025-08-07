import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AddressItem } from '../../types/address';

type Props = {
  homeAddress: AddressItem | null;
  workAddress: AddressItem | null;
  onSelect: (type: 'home' | 'work') => void;
};

export default function StepAddress({ homeAddress, workAddress, onSelect }: Props) {
  return (
    <>
      <Text className="font-pretendard font-medium text-2xl leading-loose text-white mb-8">
        주소를 입력해주세요
      </Text>

      <TouchableOpacity
        className="px-4 py-3 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-800"
        onPress={() => onSelect('home')}
      >
        <Text className="text-white font-medium text-base leading-normal">집</Text>
        <Text className="text-gray-200 font-normal text-base leading-tight">
          {homeAddress?.region || '입력'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-4 py-1.5 mb-4 rounded-[20px] flex-row justify-between items-center bg-gray-800"
        onPress={() => onSelect('work')}
      >
        <View className="flex-col">
          <Text className="text-white font-medium text-base leading-normal">
            직장/학교까지 이동 시간
          </Text>
          <Text className="text-gray-200 font-regular text-[10px] leading-3 tracking-tight">
            *선택 사항
          </Text>
        </View>
        <Text className="text-gray-100 font-normal text-base leading-tight">
          {workAddress?.region || '입력'}
        </Text>
      </TouchableOpacity>
    </>
  );
}
