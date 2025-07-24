import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import DropDown3 from '../../components/common/DropDown3';
import StepTransport from '../../components/Onboarding/StepTransport';

export default function UserInfoPage() {
  const [birthYear, setBirthYear] = useState<string | null>(null);
  const [job, setJob] = useState<string | null>(null);
  const [transport, setTransport] = useState<string[]>([]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 101 }, (_, i) => {
    const y = currentYear - i;
    return { label: String(y), value: String(y) };
  });

  const jobOptions = [
    { label: '직장인', value: 'office' },
    { label: '공무원/군인', value: 'gov' },
    { label: '자영업자', value: 'self' },
    { label: '프리랜서', value: 'freelancer' },
    { label: '학생', value: 'student' },
    { label: '무직', value: 'unemployed' },
    { label: '기타', value: 'etc' },
  ];

  const transportOptions = [
    { label: '버스', value: 'bus' },
    { label: '지하철', value: 'subway' },
    { label: '자동차', value: 'car' },
    { label: '도보', value: 'walk' },
  ];

  const onSelectTransport = (value: string) => {
    setTransport((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <>
      <BeforeHeader
        title="개인정보"
        rightLabel="저장"
        onRightPress={() => alert('저장되었습니다!')}
      />
      <ScrollView className="flex-1 bg-black px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>

        <View className="bg-gray-900 px-2 py-3 rounded-2xl mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base">출생연도</Text>
            <View className="w-[150px]">
              <DropDown3
                data={yearOptions}
                placeholder="출생연도 선택"
                value={birthYear}
                onChange={setBirthYear}
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 px-2 py-3 rounded-2xl mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base">직업</Text>
            <View className="w-[150px]">
              <DropDown3
                data={jobOptions}
                placeholder="직업 선택"
                value={job}
                onChange={setJob}
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 px-2 py-3 rounded-2xl mb-2">
          <View className="flex-row justify-between items-start gap-[71px] flex-wrap">
            <Text className="text-white text-base pt-1">선호 이동 수단</Text>
            <View className="flex-1">
              <StepTransport
                selected={transport}
                options={transportOptions}
                onSelect={onSelectTransport}
              />
            </View>
          </View>
        </View>

        <View className="mb-2">
          <View className="bg-gray-900 px-2 py-3 rounded-t-2xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base">외출 준비 시간</Text>
              <Text className="text-light">1시간</Text>
            </View>
          </View>
          <View className="bg-gray-900 px-2 py-3 rounded-b-2xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base">직장/학교까지 이동 시간</Text>
              <Text className="text-light">1시간 30분</Text>
            </View>
          </View>
        </View>


        <View className="mb-2">
          <View className="bg-gray-900 px-2 py-3 rounded-t-2xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base">집</Text>
              <Text className="text-light">서울 서대문구 대현동 11-1</Text>
            </View>
          </View>

          <View className="bg-gray-900 px-2 py-3 rounded-b-2xl ">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base">직장/학교</Text>
              <Text className="text-light">-</Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </>
  );
}
