// src/pages/WakeUpAlarmDetail.tsx
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import TransparentButton from '../../components/alarm/TransparentButton';
import PageBackButton from '../../components/common/PageBackButton';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import BottomLayout from '../../Layouts/BottomLayout';

export default function WakeUpAlarmDetail() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);

  const { height } = Dimensions.get('window');
  
  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const handleEdit = () => {
    console.log('기상 알람 설정을 편집합니다');
    navigation.navigate('EditWakeUpAlarmPage');
  }
  
  
  return (
    <BottomLayout>
        <View className="flex-row items-center justify-between mr-[4%]" 
          style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
          <PageBackButton />
          <Text className='font-pretendard text-white text-[24px] mr-[4%]'>월요일 기상 알람</Text>
          <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false}></ToggleSwitch>
        </View>
        <View className="bg-black items-center justify-center mt-[15%]">
          <View className="w-[80%] bg-blue rounded-3xl items-center justify-center"
            style={{ height: height * 0.18 }}>
            <Text className="font-pretendard text-white text-3xl">오전    08  :  00</Text>
          </View>
        </View>
        <View className="h-[55%] bg-gray-800 rounded-t-[30px] mt-[20%]">
          <Text className='text-white text-xl ml-[6%] mt-[7%]'>반복요일</Text>
          <View className="flex-row items-center justify-center mt-[4%] mx-4">
            <Text className='text-white text-xl'>   월   </Text>
            <Text className='text-white text-xl'>   화   </Text>
            <Text className='text-white text-xl'>   수   </Text>
            <Text className='text-white text-xl'>   목   </Text>
            <Text className='text-white text-xl'>   금   </Text>
            <Text className='text-white text-xl'>   토   </Text>
            <Text className='text-white text-xl'>   일   </Text>
          </View>
          <View className="self-center h-[1px] w-[85%] bg-gray-500 mt-[4%]"/>
          <View className="h-[8%] w-[80%] self-center items-center justify-between flex-row mt-[2%]">
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
            style={{ marginTop: Platform.OS === 'web' ? 40 : 35 }}>
            <TransparentButton title="편집" onPress={handleEdit} />
          </View>


        </View>
    </BottomLayout>
  );
}
