// src/pages/MyAlarmPage.tsx
// 자동알람 - 기상알람 페이지
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import { formatDate, formatTime } from '@/src/utils/AlarmFormat';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../../Layouts/BottomLayout';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function MyAlarmPage() {
  const navigation = useAppNavigation();
  const { autoAlarmOn, setAutoAlarmOn } = useAlarmContext();
  const { myAlarms, setMyAlarms } = useAlarmContext();
  const { setSelectedAlarmId } = useAlarmContext();

  const handleToggleAutoAlarm = () => {
    if (!autoAlarmOn) {
      console.log('자동알람이 켜졌습니다.');
    } else {
      console.log('자동알람이 꺼졌습니다.');
    }
    setAutoAlarmOn((prev) => !prev);
  };

  const handleGoToWakeUpPage = () => {
    console.log('기상 알람 페이지로 이동합니다.');
    navigation.navigate('WakeUpAlarmPage');
  };

  const handleGoToAlarmDetail = (id: string, title: string) => {
    setSelectedAlarmId(id);
    console.log(`${title} 알람 디테일 페이지로 이동합니다.`);
    navigation.navigate('MyAlarmDetailPage');
  };


  const handleToggleAlarm = (id: string) => {
    setMyAlarms((prev) =>
      prev.map((alarm) => {
        if (alarm.id === id) {
          const newState = !alarm.isActive;
          console.log(`${alarm.title} 알람이 ${newState ? '활성화' : '비활성화'}되었습니다.`);
          return { ...alarm, isActive: newState };
        }
        return alarm;
      })
    );
  };

  return (
    <BottomLayout>
      <View className="flex-row items-center justify-between mr-[4%] mt-[6%]">
        <Text className="font-pretendard text-white text-3xl ml-5 mb-4">내일의 자동 알람</Text>
        <ToggleSwitch isOn={autoAlarmOn} onToggle={handleToggleAutoAlarm} disabled={false} />
      </View>

      <LinearGradient
        colors={['#F7F7FE', '#4D4DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 57, padding: 1 }}
      >
        <View className="h-[8.5rem] w-full bg-dark rounded-full self-center flex-row items-center justify-between px-[4%]">
          <View className="flex-1 items-center justify-center">
            <Text className="font-pretendard text-white text-xl">6월 28일 (일)</Text>
            <Text className="font-pretendard text-white text-4xl mt-1">오전 07 : 30</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="flex-row items-start mt-[20%] ml-[4%]">
        <Text className="font-pretendard text-[24px] mr-4 text-gray-300" onPress={handleGoToWakeUpPage}>
          기상 알람
        </Text>
        <Text className="font-pretendard text-[24px] text-white font-semibold">
          내 알람
        </Text>
      </View>
      <View className="flex-row items-start mt-2">
        <View className="h-[2px] w-[21%] bg-black ml-[4%]" />
        <View className="h-[2px] w-[15%] bg-white" style={{ marginLeft: Platform.OS === 'web' ? 11 : 14 }} />
      </View>

      <View className="ml-[85%] mt-[-40px]">
        <TouchableOpacity
          onPress={() => {
            setSelectedAlarmId(null);
            navigation.navigate('EditMyAlarmPage');
          }}
        >
          <Ionicons name="add-circle-outline" size={38} color="white" />
        </TouchableOpacity>
      </View>

      <View className="mt-3">
        {myAlarms.map((alarm) => (
          <TouchableOpacity
            key={alarm.id}
            onPress={() => handleGoToAlarmDetail(alarm.id, alarm.title)}
            activeOpacity={0.8}
          >
            <View className="h-[5rem] w-[91%] bg-dark border border-dark-stroke rounded-2xl self-center flex-row items-center justify-between px-[4%] mt-4">
              <View className="flex-row items-center space-x-2">
                <View className="w-[50%]">
                  <Text className="font-pretendard text-white text-[18px]" style={{...(Platform.OS === 'web' ? { width: 160 } : {}),}}>{alarm.title}</Text>
                </View>
                <Text className="font-pretendard text-white text-xl"> ㅣ  </Text>
                <View className="flex-col">
                  <View className="flex-row items-end">
                    <Text className="font-pretendard text-white text-base">
                      {formatTime(alarm.time)}
                    </Text>
                  </View>
                  <Text className="font-pretendard text-gray-200 text-base">
                    {formatDate(alarm.date)}
                  </Text>
                </View>
              </View>
              <ToggleSwitch
                isOn={alarm.isActive}
                onToggle={() => handleToggleAlarm(alarm.id)}
                disabled={false}
              />
            </View>
          </TouchableOpacity>
        ))}

      </View>
    </BottomLayout>
  );
}
