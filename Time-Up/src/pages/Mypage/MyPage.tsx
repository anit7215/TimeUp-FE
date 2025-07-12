import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NextIcon from '../../../assets/images/NextIcon.svg';
import ProfileImage from '../../../assets/images/ProfileImage.svg';
import SignoutIcon from '../../../assets/images/signout.png';
import BottomLayout from '../../Layouts/BottomLayout';
import CancelButton from '../../components/common/CancleButton';
import ConfirmButton from '../../components/common/ConfirmButton';
import Modal from '../../components/common/Modal';

export default function MyPage() {
  const navigation = useAppNavigation();
  const [openLogout, setOpenLogout] = useState(false);
  const [openSignout, setOpenSignout] = useState(false);
  const handleLogout = () => {
    setOpenLogout(false);
    alert('로그아웃 되었습니다!');
  };
  const handleSignout = () => {
    setOpenSignout(false);
    alert('회원탈퇴 되었습니다!');
  };
  return (
  <>
    <BottomLayout>
      <View className="flex-1 items-center justify-between pt-[88px] bg-black p-4">
        <View>
          <View className="flex-row px-3 py-3 w-full items-center justify-between gap-[12px] bg-white rounded-[24px] mb-[48px]">
            <ProfileImage/>
            <Text className="text-gray-800 text-lg font-regular">example@naver.com</Text>
            <TouchableOpacity className="bg-[#CCCCFF] rounded-[6px] p-1" onPress={() => setOpenLogout(true)}>
              <Text className="text-darkblue text-[12px]">로그아웃</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-2 py-4 bg-gray-800 rounded-[12px] mb-2" onPress={() => navigation.navigate('UserInfoPage')}>
            <Text className="font-pretendard text-white text-[18px] text-medium">개인정보</Text>
            <NextIcon/>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-2 py-4 bg-gray-800 rounded-[12px] mb-2" onPress={() => navigation.navigate('UserInfoPage')}>
            <Text className="font-pretendard text-white text-[18px] text-medium">리마인드 / 알람</Text>
            <NextIcon/>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-2 py-4 bg-gray-800 rounded-[12px]" onPress={() => navigation.navigate('UserInfoPage')}>
            <Text className="font-pretendard text-white text-[18px] text-medium">자동 알람 피드백</Text>
            <NextIcon/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="w-full px-[14px] mb-[38px]" onPress={() => setOpenSignout(true)}>
          <Text className="text-gray-100 text-[12px] font-regular ">회원탈퇴</Text>
        </TouchableOpacity>
      </View>
       { openLogout && (
            <Modal onClose={() => setOpenLogout(false)} onConfirm={handleLogout}>
              로그아웃 하시겠습니까? {`\n`}
              <Text className="text-gray-700 text-sm">언제든 돌아올 수 있습니다!</Text>
            </Modal>
        )}
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
    </BottomLayout>
  </>
    
  );
}
