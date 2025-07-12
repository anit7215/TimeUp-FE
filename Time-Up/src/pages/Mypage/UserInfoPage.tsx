import React, { useState } from 'react';
import { Text, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import Dropdown from '../../components/common/DropDown';

export default function UserInfoPage() {
    const [birthYear, setBirthYear] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 101 }, (_, i) => {
    const y = currentYear - i;
    return { label: String(y), value: String(y) };
    });
  return (
  <>
    <BeforeHeader title="개인정보" rightLabel="저장" onRightPress={() => alert('저장되었습니다!')} />
    <View className="flex-1 items-center justify-center bg-black">
        <View className="flex-1 px-2 py-4 w-full items-center justify-center bg-gray-800 rounded-[8px]">
            <Text className="text-white text-base font-regular">출생연도</Text>
             <Dropdown
                data={yearOptions}
                placeholder="출생연도 선택"
                value={birthYear}
                onChange={setBirthYear}/>
        </View>
    </View>
    {/* <BottomLayout/> */}
  </>
    
  );
}
