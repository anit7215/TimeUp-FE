import React from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import BeforeHeader from '../../components/common/BeforeHeader';

export default function MyPage() {
  return (
  <>
    <BeforeHeader title="개인정보 변경" rightLabel="저장" onRightPress={() => alert('저장되었습니다!')} />
    <BottomLayout>
      
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-xl text-red-600 font-bold">마이페이지</Text>
      </View>
    </BottomLayout>
  </>
    
  );
}
