import { signout } from '@/src/apis/auth';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SignoutIcon from '../../../assets/images/signout.png';
import BeforeHeader from '../../components/common/BeforeHeader';
import CancelButton from '../../components/common/CancleButton';
import ConfirmButton from '../../components/common/ConfirmButton';
import DropDown3 from '../../components/common/DropDown3';
import StepTransport from '../../components/Onboarding/StepTransport';
import TimeModal from '../../components/Onboarding/TimeModal';
import { AddressItem } from '../../types/address';

export default function EditInfoPage() {
  const navigation = useAppNavigation();
  const [birthYear, setBirthYear] = useState<string | null>(null);
  const [job, setJob] = useState<string | null>(null);
  const [transport, setTransport] = useState<string[]>([]);
  const [homeAddress, setHomeAddress] = useState('-');
  const [workAddress, setWorkAddress] = useState('-');
  const [openSignout, setOpenSignout] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOptional, setIsOptional] = useState(false);
  const [readyTime, setReadyTime] = useState<{ hour: string; minute: string } | null>(null);
  const [commuteTime, setCommuteTime] = useState<{ hour: string; minute: string } | null>(null);
  
  const handleSignout = async () => {
    setOpenSignout(false);
    try {
      await signout();
      alert('회원탈퇴 되었습니다!');
      navigation.navigate('OnboardingPage'); 
    } catch (error) {
      alert('회원탈퇴에 실패했습니다.');
      console.error(error);
    }
  };
  const handleSelect = (hour: string, minute: string) => {
    if (isOptional) {
      setCommuteTime({ hour, minute });
    } else {
      setReadyTime({ hour, minute });
    }
    setOpen(false); 
  };
  const handleSelectAddress = (type: 'home' | 'work', address: AddressItem) => {
    if (type === 'home') {
      setHomeAddress(address.region); 
    } else {
      setWorkAddress(address.region);
    }
  };

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
    <ScrollView className="flex-1 bg-black px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
      <BeforeHeader title="개인정보" rightLabel="저장" onRightPress={()=>alert('저장됨')}/>
        <View className="bg-gray-900 px-2 py-3 rounded-lg mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base text-normal leading-tight">출생연도</Text>
            <View className="w-36">
              <DropDown3
                data={yearOptions}
                placeholder="출생연도 선택"
                value={birthYear}
                onChange={setBirthYear}
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 px-2 py-3 rounded-lg mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base text-normal leading-tight">직업</Text>
            <View className="w-36">
              <DropDown3
                data={jobOptions}
                placeholder="직업 선택"
                value={job}
                onChange={setJob}
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 px-2 py-3 rounded-lg mb-2">
          <View className="flex-row justify-between items-start gap-[71px] flex-wrap">
            <Text className="text-white text-base text-normal leading-tight">선호 이동 수단</Text>
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
          <TouchableOpacity className="bg-gray-900 px-2 py-3 rounded-t-lg" 
          onPress={() => {
            setOpen(true);
            setIsOptional(false);}}>
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base text-normal leading-tight">외출 준비 시간</Text>
              <Text className="text-light text-base text-normal leading-tight">{readyTime ? `${readyTime.hour}:${readyTime.minute}` : '입력'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-900 px-2 pt-1.5 pb-3 rounded-b-lg"
          onPress={() => {
            setOpen(true);
            setIsOptional(true);}}>
            <View className="flex-row items-center justify-between">
               <View className="flex-col">
                  <Text className="text-white text-base text-normal leading-tight">직장/학교까지 이동 시간</Text>
                  <Text className="text-gray-200 font-normal leading-3 tracking-tight text-[10px]">*선택 사항</Text>
                </View>
              <Text className="text-light text-base text-normal leading-tight">{commuteTime ? `${commuteTime.hour}:${commuteTime.minute}` : '-'}</Text>
            </View>
          </TouchableOpacity>
          {open && (
                  <TimeModal
                    visible={open}
                    onClose={() => setOpen(false)}
                    onSelect={handleSelect}
                    choice={isOptional ? 'optional' : undefined}
                  />
          )}
        </View>


        <View>
          <View className="bg-gray-900 px-2 py-3 rounded-t-lg">
            <TouchableOpacity 
            onPress={() => navigation.navigate('AddressSearchPage', {
              type: 'home',
              onSelectAddress: (address: AddressItem) => handleSelectAddress('home', address),
            })} 
            className="flex-row items-center justify-between">
              <Text className="text-white text-base text-normal leading-tighte">집</Text>
              <Text className="text-light text-base text-normal leading-tight">{homeAddress}</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-gray-900 px-2 pt-1.5 pb-3 rounded-b-lg ">
            <TouchableOpacity 
            onPress={() => navigation.navigate('AddressSearchPage', {
              type: 'work',
              onSelectAddress: (address: AddressItem) => handleSelectAddress('work', address),
            })} 
            className="flex-row items-center justify-between">
              <View className="flex-col">
                <Text className="text-white text-base text-normal leading-tight">직장/학교</Text>
                <Text className="text-gray-200 font-normal leading-3 tracking-tight text-[10px]">*선택 사항</Text>
              </View>
              <Text className="text-light text-base text-normal leading-tight">{workAddress}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="w-full px-[14px] mt-9 items-end" onPress={() => setOpenSignout(true)}>
          <Text className="text-gray-200 text-xs font-normal leading-none tracking-tight ">회원탈퇴</Text>
        </TouchableOpacity>
        { openSignout && (
            <View className="absolute inset-0 bg-black justify-center items-center px-[44px]">
              {/* <SignoutIcon width={200} height={200}/> */}
              <Image
                source={SignoutIcon}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <Text className="text-white font-pretendard font-medium text-[20px] leading-[28px] tracking-[-0.02em] mb-3 mt-6">회원 탈퇴하시겠습니까?</Text>
              <Text className="text-white font-pretendard font-normal text-[14px] leading-[20px] tracking-normal">탈퇴하시면 계정이 영구적으로 삭제됩니다.</Text>
              <View className="pb-4 flex-row justify-between gap-4 mt-6">
                <CancelButton onPress={()=>setOpenSignout(false)} />
                <ConfirmButton title="확인" onPress = {handleSignout}/>
              </View>
            </View>
        )}
    </ScrollView>
    
  );
}
