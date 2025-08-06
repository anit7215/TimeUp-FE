// src/pages/MyAlarmDetailPage.tsx
import AlarmButton from '@/src/components/alarm/AlarmButton';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import { formatDate } from '@/src/utils/AlarmFormat';
import React from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';
import PageBackButton from '../../components/common/PageBackButton';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';
import BottomLayout from '../../Layouts/BottomLayout';

import IconBiv from '../../../assets/images/AlarmBiv.svg';
import IconMemo from '../../../assets/images/AlarmMemo.svg';
import IconMusic from '../../../assets/images/AlarmMusic.svg';
import IconRepeat from '../../../assets/images/AlarmRepeat.svg';


export default function MyAlarmDetailPage() {
  const navigation = useAppNavigation();
  const { height } = Dimensions.get('window');
  const { selectedAlarmId, myAlarms, setMyAlarms, deleteAlarmById, toggleAlarmActivation, updateAlarmField } = useAlarmContext();

  const alarm = myAlarms.find(a => a.id === selectedAlarmId);

  const handleToggleSwitch = async () => {
    if (!alarm) return;

    try {
      await toggleAlarmActivation(alarm.id);
      const newState = !alarm.isActive;
      updateAlarmField(alarm.id, 'isActive', newState);
      console.log(`알람 ${alarm.id}번이 ${newState ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      console.error(`알람 ${alarm.id} 토글 실패:`, error);
    }
  };

  const handleEdit = () => {
    console.log(`${alarm!.title} 알람 설정을 편집합니다`);
    navigation.navigate('EditMyAlarmPage');
  };

const handleDelete = async () => {
  if (!selectedAlarmId) return;

    // ✅ 로컬 상태에서 알람 존재 여부 확인
  if (!myAlarms.some(alarm => alarm.id === selectedAlarmId)) {
    console.warn('삭제하려는 알람이 로컬 상태에 없습니다.');
    return;
  }
  else {
    console.log(`삭제하려는 알람이 로컬에 있습니다.`);
  }

  try {
    await deleteAlarmById(selectedAlarmId); // 성공적으로 삭제
    setMyAlarms(prev => prev.filter(a => a.id !== selectedAlarmId)); // 상태에서 제거
    navigation.navigate('MyAlarmPage');
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`알람 ${selectedAlarmId}는 이미 존재하지 않습니다.`);
      // 그래도 상태에서 제거하고 페이지 이동
      setMyAlarms(prev => prev.filter(a => a.id !== selectedAlarmId));
      navigation.navigate('MyAlarmPage');
    } else {
      console.error('알람 삭제 실패:', error);
      // 필요 시 사용자에게 에러 알림 추가 가능
    }
  }
};

  if (!alarm) {
    return (
      <BottomLayout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-xl">알람 정보를 찾을 수 없습니다.</Text>
        </View>
      </BottomLayout>
    );
  }

  return (
    <BottomLayout>
      <View className="flex-row items-center justify-between mr-[4%]" style={{ marginTop: Platform.OS === 'web' ? 30 : 0 }}>
        <PageBackButton goTo="MyAlarmPage" />
        <Text className="font-pretendard text-white text-[24px] mr-[4%]" style={{ width: Platform.OS === 'web' ? 300 : 210 }}>{alarm.title}</Text>
        <ToggleSwitch isOn={alarm.isActive} onToggle={handleToggleSwitch} disabled={false} />
      </View>

      <View className="bg-black items-center justify-center -mt-5">
        <View className="w-[80%] items-center justify-center"
          style={{ height: Platform.OS === 'web' ? height * 0.28 : height * 0.28 }}>
          <Text className="font-pretendard text-white text-3xl mb-4">{formatDate(alarm.date)}</Text>
          <View className="flex-row items-center">
            <Text className="font-pretendard text-white text-[33px] mt-1">{alarm.time.period}  </Text>
            <Text className="font-pretendard text-white text-[42px] ml-2">
              {String(alarm.time.hour).padStart(2, '0')} : {String(alarm.time.minute).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>


      <View className="w-full h-[55%] items-center gap-3 space-y-3">
        <View className="w-[91%] flex-row gap-3">
          <View className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3">
            <View className="flex-row items-center">
              <IconMusic width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">알람음</Text>
            </View>
            <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
              <Text className="font-pretendard text-gray-200 text-[19px] font-semibold">
                {alarm.sound && alarm.sound !== '선택' ? alarm.sound : '-'}
              </Text>
            </View>
          </View>
          <View className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3">
            <View className="flex-row items-center">
              <IconBiv width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">진동</Text>
            </View>
            <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
              <Text className="font-pretendard text-gray-200 text-[19px] font-semibold">
                {alarm.vibrate && alarm.vibrate !== '선택' ? alarm.vibrate : '-'}
              </Text>
            </View>
          </View>
        </View>

        <View className="w-[91%] h-[80px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3">
          <View className="flex-row items-center">
            <IconRepeat width={20} height={20} />
            <Text className="font-pretendard text-gray-200 text-xl ml-2">다시 울림</Text>
          </View>
          <Text className="font-pretendard text-gray-200 text-[19px] font-semibold ml-2">
            {alarm.repeat && alarm.repeat !== '선택' ? alarm.repeat : '-'}
          </Text>
        </View>

        <View
          className="w-[91%] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
          style={{ height: Platform.OS === 'web' ? height * 0.25 : height * 0.185 }}
        >
          <View className="flex-row items-center">
            <IconMemo width={20} height={20} />
            <Text className="font-pretendard text-gray-200 text-xl ml-2">메모</Text>
          </View>
          <Text className="font-pretendard text-gray-200 text-[19px] font-semibold ml-2">
            {alarm.memo.trim() !== '' ? alarm.memo : '-'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-10 -mt-[4%]">
        <AlarmButton title="삭제" onPress={handleDelete} backgroundColor="#1C1F21" textColor="#CFD3D7" style={{ width: 120, height: 48 }} />
        <AlarmButton title="편집" onPress={handleEdit} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
      </View>

    </BottomLayout>
  );
}
