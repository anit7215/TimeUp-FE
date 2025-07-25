// src/pages/MyAlarmDetailPage.tsx
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import TransparentButton from '../../components/alarm/TransparentButton';
import PageBackButton from '../../components/common/PageBackButton';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import BottomLayout from '../../Layouts/BottomLayout';

export default function MyAlarmDetailPage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);

  const { height } = Dimensions.get('window');
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleEdit = () => {
    console.log('내 알람 설정을 편집합니다');
    navigation.navigate('EditMyAlarmPage');
  }
  
  
  return (
      <BottomLayout>
        <View className="flex-row items-center justify-between mr-[4%]" 
          style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
          <PageBackButton />
          <Text className='font-pretendard text-white text-[24px] mr-[4%]'>딥러닝 과제 제출</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="bg-black items-center justify-center mt-[15%]">
          <View className="w-[80%] bg-blue rounded-3xl items-center justify-center"
            style={{ height: height * 0.18 }}>
            <Text className="font-pretendard text-white text-2xl mb-4">5월 21일 (수)</Text>
            <Text className="font-pretendard text-white text-3xl">오전    12  :  00</Text>
          </View>
        </View>
        <View className="h-[55%] bg-gray-800 rounded-t-[30px] mt-[20%]">
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[8%]">
            <Text className="font-pretendard text-white text-xl">알람음</Text>
            <Text className="font-pretendard text-white ml-[5%] text-xl">Heavy Raindrop</Text>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
            <Text className="font-pretendard text-white text-xl">진동</Text>
            <Text className="font-pretendard text-white ml-[5%] text-xl">Basic Ring</Text>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
            <Text className="font-pretendard text-white text-xl">다시 울림</Text>
            <Text className="font-pretendard text-white ml-[5%] text-xl">10분, 5회</Text>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[2%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
            <Text className="font-pretendard text-white text-xl">메모</Text>
          </View>

          <View className="flex-row items-center justify-center mx-4 gap-3"
            style={{ marginTop: Platform.OS === 'web' ? 150 : 100 }}>
            <TransparentButton title="삭제" onPress={handleEdit} />
            <TransparentButton title="편집" onPress={handleEdit} />
          </View>


        </View>
      </BottomLayout>
  );
}
