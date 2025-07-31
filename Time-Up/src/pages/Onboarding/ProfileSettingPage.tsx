import React, { useState } from 'react';
import { View, Text } from 'react-native';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import BeforeHeader from '../../components/common/BeforeHeader';
import Modal from '../../components/common/Modal';
import NextButton from '../../components/common/NextButton';
import StepAddress from '../../components/Onboarding/StepAddress';
import StepForm from '../../components/Onboarding/StepForm';
import StepTime from '../../components/Onboarding/StepTime';
import StepTransport from '../../components/Onboarding/StepTransport';
import StepWakeUp from '../../components/Onboarding/StepWakeUp';
import { AddressItem } from '../../types/address';

export default function ProfileSettingPage() {
  const navigation = useAppNavigation();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const [birthYear, setBirthYear] = useState<string | null>(null);
  const [job, setJob] = useState<string | null>(null);
  const [transport, setTransport] = useState<string[]>([]);
  const [homeAddress, setHomeAddress] = useState<AddressItem | null>(null);
  const [workAddress, setWorkAddress] = useState<AddressItem | null>(null);

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
    setTransport((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSelectAddress = (type: 'home' | 'work') => {
    navigation.navigate('AddressSearchPage', {
      type,
      onSelectAddress: (address: AddressItem) => {
        if (type === 'home') setHomeAddress(address);
        else setWorkAddress(address);
      },
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <StepForm
            text="태어난 연도를 선택해주세요"
            options={yearOptions}
            placeholder="출생연도 선택"
            value={birthYear}
            onChange={setBirthYear}
          />
        );
      case 2:
        return (
          <StepForm
            text="직업을 선택해주세요"
            options={jobOptions}
            placeholder="직업 선택"
            value={job}
            onChange={setJob}
          />
        );
      case 3:
        return (
          <>
            <Text className="font-pretendard font-medium text-2xl leading-loose text-white mb-8">
              선호하는 이동 수단을 알려주세요
            </Text>
            <StepTransport
              selected={transport}
              options={transportOptions}
              onSelect={onSelectTransport}
            />
          </>
        );
      case 4:
        return <StepTime />;
      case 5:
        return <StepWakeUp />;
      case 6:
        return (
          <StepAddress
            homeAddress={homeAddress}
            workAddress={workAddress}
            onSelect={handleSelectAddress}
          />
        );
      default:
        return (
          <Text className="font-pretendard font-medium text-[24px] leading-[32px] tracking-[-0.02em] text-white mb-9">
            다시 시도해주세요
          </Text>
        );
    }
  };

  return (
    <View className="flex-1 bg-black p-4 pt-6 pb-[80px] justify-between">
      {step > 1 ? (
        <BeforeHeader onBackPress={() => setStep(step - 1)} />
      ) : (
        <View className="mb-[72px]" />
      )}
      <View className="flex-1 justify-start">{renderStepContent()}</View>
      <NextButton
        title={step < 6 ? '다음' : '제출'}
        onPress={() => {
          if (step < 6) setStep(step + 1);
          else setOpen(true);
        }}
        disabled={
          (step === 1 && !birthYear) ||
          (step === 2 && !job) ||
          (step === 3 && transport.length !== transportOptions.length)
        }
      />
      {open && (
        <Modal
          onClose={() => setOpen(false)}
          onConfirm={() => navigation.navigate('MyPage')}
        >
          {'지금까지 입력하신 내용을 \n제출하시겠습니까?'}
        </Modal>
      )}
    </View>
  );
}
