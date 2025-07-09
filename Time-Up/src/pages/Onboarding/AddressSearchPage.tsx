import React from 'react';
import { TextInput, View } from 'react-native';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
export default function AddressSearchPage() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
        {/* 뒤로가기 헤더 컴포넌트 불러오기 */}

        <View className="w-full h-12 px-4 border border-gray rounded-[20px] flex-row items-center mt-4">
            <TextInput
                className="flex-1 text-black"
                placeholder="주소 검색"
                placeholderTextColor="gray"
            />
            <SearchIcon width={20} height={20} />
        </View>
    </View>
  );
}
