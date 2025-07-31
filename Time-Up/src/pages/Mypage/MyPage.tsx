import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NextIcon from '../../../assets/images/NextIcon.svg';
import ProfileImage from '../../../assets/images/ProfileImage.svg';
import BottomLayout from '../../Layouts/BottomLayout';
import Modal from '../../components/common/Modal';

export default function MyPage() {
  const navigation = useAppNavigation();
  const [openLogout, setOpenLogout] = useState(false);
  const handleLogout = () => {
    setOpenLogout(false);
    alert('로그아웃 되었습니다!');
  };
  return (
  <>
    <BottomLayout>
      <View className="flex-1 items-center justify-between bg-black px-4 pt-6">
        <View>
          <View className="flex-row px-3 py-3 w-full items-center justify-between gap-[12px] bg-white rounded-[24px] mb-12">
            <ProfileImage/>
            <Text className="text-gray-800 text-lg font-regular">example@naver.com</Text>
            <TouchableOpacity className="bg-[#CCCCFF] rounded-[6px] p-1" onPress={() => setOpenLogout(true)}>
              <Text className="text-darkblue text-[12px]">로그아웃</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-2 py-4 bg-gray-900 rounded-[12px] mb-2" onPress={() => navigation.navigate('EditInfoPage')}>
            <Text className="font-pretendard text-white text-[18px] text-medium">개인정보</Text>
            <NextIcon/>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-2 py-4 bg-gray-900 rounded-[12px] mb-2" onPress={() => navigation.navigate('EditAlarmPage')}>
            <Text className="font-pretendard text-white text-[18px] text-medium">리마인드 / 알람</Text>
            <NextIcon/>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-2 py-4 bg-gray-900 rounded-[12px]" onPress={() => navigation.navigate('FeedbackPage')}>
            <Text className="font-pretendard text-white text-[18px] text-medium">자동 알람 피드백</Text>
            <NextIcon/>
          </TouchableOpacity>
        </View>
      </View>
       { openLogout && (
            <Modal onClose={() => setOpenLogout(false)} onConfirm={handleLogout}>
              로그아웃 하시겠습니까? {`\n`}
              <Text className="text-gray-700 text-sm">언제든 돌아올 수 있습니다!</Text>
            </Modal>
        )}
    </BottomLayout>
  </>
    
  );
}
