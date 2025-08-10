import { signout } from '@/src/apis/auth';
import { jobOptions, transportOptions, yearOptions } from '@/src/constants/userOptions';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import { useGetUserInfo } from '@/src/hooks/users/useGetUserInfo';
import { JobType } from '@/src/types/user';
import { formatTime } from '@/src/utils/userTimeFormat';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SignoutIcon from '../../../assets/images/SignoutIcon.svg';
import BeforeHeader from '../../components/common/BeforeHeader';
import CancelButton from '../../components/common/CancleButton';
import ConfirmButton from '../../components/common/ConfirmButton';
import DropDown3 from '../../components/common/DropDown3';
import Modal from '../../components/common/Modal';
import StepTransport from '../../components/Onboarding/StepTransport';
import TimeModal from '../../components/Onboarding/TimeModal';
import { useProfileStore } from '../../stores/useProfileStore';
import { AddressItem } from '../../types/address';
import { useUpdateUserInfo } from '@/src/hooks/mutation/my/useUpdateUserInfo';

export default function EditInfoPage() {
  const navigation = useAppNavigation();
  const {birthYear, job, transport, homeAddress, workAddress, readyTime, commuteTime, setField, toggleTransport,} = useProfileStore();
  const { data: userInfo } = useGetUserInfo();
  const [openSignout, setOpenSignout] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOptional, setIsOptional] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<'missing' | 'confirm'>('missing');
  const updateUserInfoMutation = useUpdateUserInfo();
  
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

  useEffect(() => {
    if (userInfo) {
      setField('birthYear', userInfo.birth.toString());
      setField('job', userInfo.job);
      setField(
        'transport',
        userInfo.user_preference_transport ? userInfo.user_preference_transport.map((p) => p.transport) : [],
      );
      setField('homeAddress', userInfo.home_address);
      setField('workAddress', userInfo.work_address);
      setField('readyTime', {
        hour: Math.floor(userInfo.avg_ready_time / 60).toString().padStart(2, '0'),
        minute: (userInfo.avg_ready_time % 60).toString().padStart(2, '0'),
      });
      setField('commuteTime', {
        hour: Math.floor(userInfo.duration_time / 60).toString().padStart(2, '0'),
        minute: (userInfo.duration_time % 60).toString().padStart(2, '0'),
      });
    }
  }, [userInfo]);

  const handleSelect = (hour: string, minute: string) => {
    if (isOptional) {
      setField('commuteTime', { hour, minute });
    } else {
      setField('readyTime', { hour, minute });
    }
    setOpen(false);
  };
  const handleSelectAddress = (type: 'home' | 'work', address: AddressItem) => {
    setField(type === 'home' ? 'homeAddress' : 'workAddress', address.region);
  };

  const onSelectTransport = (value: string) => {
    toggleTransport(value as any);
  };

  const getApiJobLabel = (jobValue: string | null | undefined): JobType | undefined => {
    if (!jobValue) return undefined;
    const found = jobOptions.find((opt) => opt.value === jobValue);
    return found ? (found.label as JobType) : undefined;
  };


  const handleSave = () => {
  const isMissing =
    !birthYear || !job || transport.length !== transportOptions.length || !readyTime ||!homeAddress || homeAddress === '-';
    if (isMissing) {
      setModalType('missing');
      setOpenModal(true);
    } else {
      setModalType('confirm');
      setOpenModal(true);
    }
  };
  const handleConfirm = () => {
    if (modalType === 'confirm') {
      const avgReadyTime =
        readyTime
          ? Number(readyTime.hour) * 60 + Number(readyTime.minute)
          : 0;
      const durationTime =
        commuteTime
          ? Number(commuteTime.hour) * 60 + Number(commuteTime.minute)
          : 0;

      const payload = {
        birth: Number(birthYear),
        job: job ?? getApiJobLabel(job),
        user_preference_transport: transport.map((t, idx) => ({
          transport: t,
          priority: idx + 1,
        })),
        home_address: homeAddress ?? '',
        work_address: workAddress ?? '',
        avg_ready_time: avgReadyTime,
        duration_time: durationTime,
      };

      updateUserInfoMutation.mutate(payload, {
        onSuccess: () => {
          alert('저장되었습니다!');
          navigation.navigate('MyPage');
        },
        onError: (error) => {
          alert('저장에 실패했습니다.');
          console.error(error);
        },
      });
    }
  };



  return (
    <>
    <ScrollView className="flex-1 bg-black px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
      <BeforeHeader title="개인정보" rightLabel="저장" onRightPress={handleSave}/>
        <View className="bg-gray-900 px-2 py-3 rounded-lg mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base">출생연도</Text>
            <View className="w-1/2">
              <DropDown3
                data={yearOptions}
                placeholder="출생연도 선택"
                value={birthYear}
                onChange={(v) => setField('birthYear', v)}
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 px-2 py-3 rounded-lg mb-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-base">직업</Text>
            <View className="w-1/2">
              <DropDown3
                data={jobOptions}
                placeholder="직업 선택"
                value={job}
                onChange={(v) => setField('job', v as JobType)} 
              />
            </View>
          </View>
        </View>

        <View className="bg-gray-900 px-2 py-3 rounded-lg mb-2">
          <View className="flex-row justify-between items-start gap-[71px] flex-wrap">
            <Text className="text-white text-base">선호 이동 수단</Text>
            <View className="flex-1">
              <StepTransport selected={transport} options={transportOptions} onSelect={onSelectTransport} />
            </View>
          </View>
        </View>

        <View className="mb-2">
          <TouchableOpacity className="bg-gray-900 px-2 py-3 rounded-t-lg"
          onPress={() => {
            setOpen(true);
            setIsOptional(false);}}>
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-base">외출 준비 시간</Text>
              <Text className="text-light text-base">{formatTime(readyTime)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-900 px-2 pt-1.5 pb-3 rounded-b-lg"
          onPress={() => {
            setOpen(true);
            setIsOptional(true);}}>
            <View className="flex-row items-center justify-between">
              <View className="flex-col">
                <Text className="text-white text-base">직장/학교까지 이동 시간</Text>
                <Text className="text-gray-200 text-[10px]">*선택 사항</Text>
              </View>
              <Text className="text-light text-base">{formatTime(commuteTime)}</Text>
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
              <Text className="text-white text-base">집</Text>
              <Text className="text-light text-base">{homeAddress ?? '-'}</Text>
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
                <Text className="text-white text-base">직장/학교</Text>
                <Text className="text-gray-200 text-[10px]">*선택 사항</Text>
              </View>
              <Text className="text-light text-base text-normal leading-tight">{workAddress ?? '-'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity className="w-full px-[14px] mt-9 items-end" onPress={() => setOpenSignout(true)}>
          <Text className="text-gray-200 text-xs">회원탈퇴</Text>
        </TouchableOpacity>
        { openSignout && (
            <View className="absolute inset-0 bg-black justify-center items-center px-[44px]">
              <SignoutIcon width={200} height={200}/>
              <Text className="text-white font-medium text-xl leading-7 mb-3 mt-6">회원 탈퇴하시겠습니까?</Text>
              <Text className="text-gray-200 font-tight text-sm leading-[20px]">탈퇴하시면 계정이 영구적으로 삭제됩니다.</Text>
              <View className="flex-row w-full justify-between gap-4 mt-9">
                <View className="flex-1">
                  <CancelButton onPress={() => setOpenSignout(false)} />
                </View>
                <View className="flex-1">
                  <ConfirmButton title="확인" onPress={handleSignout} />
                </View>
              </View>
            </View>
        )}
    </ScrollView>          
    {openModal && (
      <Modal
        onClose={() => setOpenModal(false)}
        onConfirm={modalType === 'confirm' ? handleConfirm : undefined}>
          {modalType === 'missing' ? '필수 정보를 모두 입력해주세요' : '저장하시겠습니까?'}
       </Modal>
          )}
    </>
  );
}
