import { logout } from '@/src/apis/auth';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import NextIcon from '../../../assets/images/NextIcon.svg';
import ProfileImage from '../../../assets/images/ProfileImage.svg';
import BottomLayout from '../../Layouts/BottomLayout';
import Modal from '../../components/common/Modal';

export default function MyPage() {
  const navigation = useAppNavigation();
  const [openLogout, setOpenLogout] = useState(false);
  const handleLogout = async () => {
    setOpenLogout(false);
    try {
      await logout();
      alert('로그아웃 되었습니다!');
      navigation.navigate('OnboardingPage'); 
    } catch (error) {
      alert('로그아웃에 실패했습니다.');
      console.error(error);
    }
  };
  return (
  <>
    <BottomLayout>
      <View className="flex-1 justify-between bg-black px-4 pt-6 w-full">
        <View>
          <View className="flex-row px-3 py-3 w-full items-center justify-between gap-3 bg-white rounded-[20px] mb-12">
            <ProfileImage/>
            <Text className="text-gray-900 text-lg font-normal leading-normal font-pretendard">example@naver.com</Text>
            <TouchableOpacity className="bg-[#CCCCFF] rounded-md p-1 items-center" onPress={() => setOpenLogout(true)}>
              <Text className="text-dark text-xs font-normal leading-none font-pretendard">로그아웃</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-4 py-4 bg-gray-900 rounded-[20px] mb-2" onPress={() => navigation.navigate('EditInfoPage')}>
            <Text className="font-pretendard text-white text-lg leading-relaxed text-medium font-pretendard">개인정보</Text>
            <NextIcon/>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-4 py-4 bg-gray-900 rounded-[20px] mb-2" onPress={() => navigation.navigate('EditAlarmPage')}>
            <Text className="font-pretendard text-white text-lg leading-relaxed text-medium font-pretendard">리마인드 / 알람</Text>
            <NextIcon/>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between w-full px-4 py-4 bg-gray-900 rounded-[20px]" onPress={() => navigation.navigate('FeedbackPage')}>
            <Text className="font-pretendard text-white text-lg leading-relaxed text-medium">자동 알람 피드백</Text>
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
