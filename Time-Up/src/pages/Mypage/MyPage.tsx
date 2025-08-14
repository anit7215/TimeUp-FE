import { logout } from '@/src/apis/auth';
import { getAlarmList } from '@/src/apis/users';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import { useGetUserInfo } from '@/src/hooks/users/useGetUserInfo';
import { useProfileStore } from '@/src/stores/useProfileStore';
import { hasSubmittedFeedback } from '@/src/utils/feedbackStorage';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NextIcon from '../../../assets/images/NextIcon.svg';
import ProfileImage from '../../../assets/images/ProfileImage.svg';
import BottomLayout from '../../Layouts/BottomLayout';
import Modal from '../../components/common/Modal';

export default function MyPage() {
  const navigation = useAppNavigation();
  const [openLogout, setOpenLogout] = useState(false);
  const [email, setEmail]=useState<string|null>(null);
  const { data: userInfo, isLoading, error } = useGetUserInfo();
  const { profileImage } = useProfileStore();
  const [isChecking, setIsChecking] = useState(false);
  const [infoModal, setInfoModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useEffect(()=>{
    if(userInfo){
      setEmail(userInfo.email);
    }
  },[userInfo]);

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

  const handleFeedbackPress = async () => {
    setIsChecking(true);
    try {
      const alarmList = await getAlarmList();
      const today = new Date().toISOString().slice(0, 10);
      const todayAlarm = alarmList?.auto_alarms?.find((alarm: any) => 
        alarm.alarm_time?.slice(0, 10) === today
      );
      
      if (!todayAlarm) {
        setInfoModal({ visible: true, message: '피드백할 자동 알람이 없습니다!' });
        return;
      }
      const alreadySubmitted = await hasSubmittedFeedback(todayAlarm.auto_alarm_id);
      if (alreadySubmitted) {
        setInfoModal({ visible: true, message: '피드백을 이미 제출하셨습니다!' });
        return;
      }

      navigation.navigate('FeedbackPage', { alarmId: todayAlarm.auto_alarm_id });

    } catch (error) {
      console.error("피드백 확인 중 오류:", error);
      alert("알람 정보를 확인하는 중 오류가 발생했습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
  <>
    <BottomLayout>
      <View className="flex-1 justify-between bg-black px-4 pt-6 w-full">
        <View>
          <View className="flex-row px-3 py-3 w-full items-center justify-between gap-3 bg-white rounded-[20px] mb-12">
            {
              profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <ProfileImage/>
              )
            }
            <Text className="text-gray-900 text-lg font-normal leading-normal font-pretendard">{email}</Text>
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
          <TouchableOpacity className="flex-row items-center justify-between w-full px-4 py-4 bg-gray-900 rounded-[20px]"onPress={handleFeedbackPress} disabled={isChecking}>
            <Text className="font-pretendard text-white text-lg leading-relaxed text-medium">자동 알람 피드백</Text>
            <NextIcon/>
          </TouchableOpacity>
        </View>
      </View>
       { openLogout && (
            <Modal onClose={() => setOpenLogout(false)} onConfirm={handleLogout}>
              로그아웃 하시겠습니까? {`\n`}
              <Text className="text-gray-800 text-sm">언제든 돌아올 수 있습니다!</Text>
            </Modal>
        )}
        {infoModal.visible && (
          <Modal 
            onClose={() => setInfoModal({ visible: false, message: '' })}
            onConfirm={() => setInfoModal({ visible: false, message: '' })}>
            {infoModal.message}
          </Modal>
        )}
    </BottomLayout>
  </>
    
  );
}
