// src/pages/AlarmReplayPage.tsx
import React from 'react';
import { Text, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import TransparentButton from '../../components/alarm/TransparentButton';
import CheckBox from '../../components/common/CheckBox';
import PageBackButton from '../../components/common/PageBackButton';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function SelectAlarmReplayPage() {
  const navigation = useAppNavigation();
  const [selectedInterval, setSelectedInterval] = React.useState<string | null>(null);
  const [selectedCount, setSelectedCount] = React.useState<string | null>(null);


  const handleConfirm = () => {
    console.log('확인 버튼 클릭됨');
    console.log(`선택된 반복 간격: ${selectedInterval}`);
    console.log(`선택된 반복 횟수: ${selectedCount}`);
    navigation.goBack();
  };

  const handleSelectInterval = (option: string) => {
    setSelectedInterval(option);
    console.log(`선택된 간격: ${option}`);
  };

  const handleSelectCount = (option: string) => {
    setSelectedCount(option);
    console.log(`선택된 횟수: ${option}`);
  };


  return (
    <BottomLayout>
      <View className="flex-row mt-3 items-center justify-between">
        <PageBackButton />
        <TransparentButton title="확인" onPress={handleConfirm} />
      </View>
      <Text className="text-xl text-white ml-9 mt-8">반복 간격</Text>
      <View className="flex-row ml-9 mt-6">
        <CheckBox
          isChecked={selectedInterval === '5분'}
          onValueChangeHandler={() => handleSelectInterval('5분')}
          disabled={false}
        />
        <Text className="text-white text-xl ml-4">5분</Text>
      </View>

      <View className="flex-row ml-9 mt-6">
        <CheckBox
          isChecked={selectedInterval === '10분'}
          onValueChangeHandler={() => handleSelectInterval('10분')}
          disabled={false}
        />
        <Text className="text-white text-xl ml-4">10분</Text>
      </View>

      <View className="flex-row ml-9 mt-6">
        <CheckBox
          isChecked={selectedInterval === '15분'}
          onValueChangeHandler={() => handleSelectInterval('15분')}
          disabled={false}
        />
        <Text className="text-white text-xl ml-4">15분</Text>
      </View>

      <View className="flex-row ml-9 mt-6">
        <CheckBox
          isChecked={selectedInterval === '20분'}
          onValueChangeHandler={() => handleSelectInterval('20분')}
          disabled={false}
        />
        <Text className="text-white text-xl ml-4">20분</Text>
      </View>


      <Text className="text-xl text-white ml-9 mt-16">반복 기간</Text>
      <View className="flex-row ml-9 mt-6">
        <CheckBox
          isChecked={selectedCount === '3회'}
          onValueChangeHandler={() => handleSelectCount('3회')}
          disabled={false}
        />
        <Text className="text-white text-xl ml-4">3회</Text>
      </View>

      <View className="flex-row ml-9 mt-6">
        <CheckBox
          isChecked={selectedCount === '5회'}
          onValueChangeHandler={() => handleSelectCount('5회')}
          disabled={false}
        />
        <Text className="text-white text-xl ml-4">5회</Text>
      </View>

    </BottomLayout>
  );
}
