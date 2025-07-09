import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import BeforeButton from '../../components/Onboarding/BeforeButton';
import NextButton from '../../components/Onboarding/NextButton';
import StepAddress from '../../components/Onboarding/StepAddress';
import StepForm from '../../components/Onboarding/StepForm';
import StepTime from '../../components/Onboarding/StepTime';
import StepTransport from '../../components/Onboarding/StepTransport';
import StepWakeUp from '../../components/Onboarding/StepWakeUp';
import Modal from '../../components/common/Modal';

export default function ProfileSettingPage() {
    const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

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
        return (<StepTransport
          selected={transport}
          options={transportOptions}
          onSelect={onSelectTransport}/>);
      case 4:
        return (
          <StepTime/>
        );
      case 5:
        return (
          <StepWakeUp/>
        );
      case 6:
        return (
          <StepAddress/>
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
    <View className="flex-1 pt-[88px] bg-black p-4 pb-[80px] justify-between">
      <View>{renderStepContent()}</View>

      <View className="flex-row justify-between">
        {step > 1 ? (
          <BeforeButton onPress={() => setStep(step - 1)} />
        ) : (
          <View />
        )}

        {step < 6 ? (
          <NextButton
            onPress={() => setStep(step + 1)}
            disabled={
              (step === 1 && !birthYear) ||
              (step === 2 && !job) ||
              (step === 3 && transport.length !== transportOptions.length)
              // step 4, 5, 6 추가 예정
            }
          />
        ) : (
            <NextButton title="제출" onPress={() => setOpen(true)} />
        )}
      </View>
      {open && (
        // 확인 시 로직 추가 예정
        <Modal onClose={() => setOpen(false)} >
          {"지금까지 입력하신 내용을 \n제출하시겠습니까?"}
        </Modal>
      )}
    </View>
  );
}
