// src/pages/MyAlarmPage.tsx
import { postMyAlarm } from '@/src/apis/alarmApi';
import { axiosInstance } from '@/src/apis/axiosInstance';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import type { AlarmItem, GetAllAlarmsResponse } from '@/src/types/alarm';
import { formatDate, formatTime } from '@/src/utils/AlarmFormat';
import { AlarmWithoutId, toPostMyAlarmRequest } from '@/src/utils/alarmTransform';
import { getAccessToken } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import BottomLayout from '../../../Layouts/BottomLayout';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import useAppNavigation from '../../../hooks/useAppNavigation';

export default function MyAlarmPage() {
  const navigation = useAppNavigation();
  const {
    autoAlarmOn, setAutoAlarmOn,
    autoAlarms, setAutoAlarms,
    myAlarms, setMyAlarms,
    setSelectedAlarmId, updateAlarmField, toggleAlarmActivation,
    toggleAutoAlarmActiveById,
  } = useAlarmContext();

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const token = await getAccessToken();
        const res = await axiosInstance.get<GetAllAlarmsResponse>(
          '/alarm/alarmlist',
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
          // 전체 응답 출력
          console.log('전체 알람 응답:', res.data);
  
          console.log('기상 알람 목록:', res.data.success?.wakeup_alarms ?? []);
          console.log('자동 알람 목록:', res.data.success?.auto_alarms ?? []);
          console.log('내 알람 목록:', res.data.success?.my_alarms ?? []);
  
        } catch (err) {
          console.error('전체 알람 조회 실패:', err);
        }
      };
  
      fetchAlarms();
    }, []);
  
  // 가장 가까운 자동 알람 선택
  const nextAutoAlarm = React.useMemo(() => {
    if (!autoAlarms || autoAlarms.length === 0) return null;
    const sorted = [...autoAlarms].sort(
      (a, b) => new Date(a.wakeup_time).getTime() - new Date(b.wakeup_time).getTime()
    );
    return sorted[0];
  }, [autoAlarms]);
  
  // 날짜/시간 포맷터 (KST 기준, 디바이스 로컬 시간 사용)
  const formatAutoDateLine = (iso: string) => {
    const d = new Date(iso);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  };
  const formatAutoTimeLine = (iso: string) => {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes();
    const period = h < 12 ? '오전' : '오후';
    const hh = (h % 12) || 12;
    return `${period} ${String(hh).padStart(2, '0')} : ${String(m).padStart(2, '0')}`;
  };


  const handleToggleAutoAlarm = () => {
    if (!autoAlarmOn) {
      console.log('자동알람이 켜졌습니다.');
    } else {
      console.log('자동알람이 꺼졌습니다.');
    }
    setAutoAlarmOn((prev) => !prev);
  };

  //   const handleToggleAutoAlarm = async () => {
  //   try {
  //     if (nextAutoAlarm?.auto_alarm_id != null) {
  //       await toggleAutoAlarmActiveById(nextAutoAlarm.auto_alarm_id);
  //       // nextAutoAlarm이 갱신되므로 autoAlarmOn은 컨텍스트에서 이미 반영됨.
  //       console.log('자동알람 토글 완료');
  //     } else {
  //       // 아직 자동 알람이 계산/생성 전: 로컬 스위치만 반전
  //       setAutoAlarmOn(prev => !prev);
  //     }
  //   } catch (e) {
  //     console.error('자동알람 토글 실패:', e);
  //   }
  // };

  const handleGoToWakeUpPage = () => {
    console.log('기상 알람 페이지로 이동합니다.');
    navigation.navigate('WakeUpAlarmPage');
  };

  const handleGoToAlarmDetail = (alarm: AlarmItem) => {
    const remoteId = (alarm as any).serverId ?? alarm.id; // 서버ID 최우선
    if (remoteId == null) {
      console.warn('서버 ID가 없습니다.');
      return;
    }
    setSelectedAlarmId(remoteId);
    console.log(`${remoteId} 알람 디테일 페이지로 이동합니다.`);
    navigation.navigate('MyAlarmDetailPage');
  };

  const handleToggleAlarm = async (id: number, currentState: boolean) => {
    try {
      await toggleAlarmActivation(id);
      const newState = !currentState;
      updateAlarmField(id, 'isActive', newState);
      console.log(`알람 ${id}번이 ${newState ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      console.error(`알람 ${id}번 토글 실패:`, error);
    }
  };

  const handleNewAlarm = async () => {
    debugger;
    //debugger;
    // 날짜-시간 조정하기. 오전 오후 시간 계산? 우선 안전하게 하루 뒤로 지정해 둠.
    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const defaultAlarm: AlarmWithoutId = {
        title: '',
        time: {
          period: tomorrow.getHours() < 12 ? '오전' : '오후',
          hour: tomorrow.getHours() % 12 || 12,
          minute: tomorrow.getMinutes(),
        },
        date: {
          fullDate: tomorrow.toISOString().split('T')[0],
          dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][tomorrow.getDay()],
        },
        sound: '선택',
        vibrate: '선택',
        repeat: '선택',
        memo: '',
        isActive: true,
        isSound: false,
        isVibrating: false,
        isRepeating: false,
      };

      const requestBody = toPostMyAlarmRequest(defaultAlarm);
      console.log('보낼 요청 데이터:', requestBody);
      const response = await postMyAlarm(requestBody);
      console.log('응답 데이터:', response);

      const newAlarmId = response.success?.alarm_id;
      if (!newAlarmId) throw new Error('alarm_id 없음');

      const newAlarm: AlarmItem = {
        id: newAlarmId,
        ...defaultAlarm,
      };

      setMyAlarms(prev => [...prev, newAlarm]);
      setSelectedAlarmId(newAlarmId);
      navigation.navigate('EditMyAlarmPage');
    } catch (error) {
      console.error('알람 생성 실패:', error);
    }
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
        style={{ borderRadius: 70, padding: 1 }}
      >
        <View className="h-[8.5rem] w-full bg-dark rounded-full self-center flex-row items-center justify-between px-[4%]">
          <View className="flex-1 items-center justify-center">
            {nextAutoAlarm ? (
              <>
                <Text className="font-pretendard text-white text-xl">
                  {formatAutoDateLine(nextAutoAlarm.wakeup_time)}
                </Text>
                <Text className="font-pretendard text-white text-4xl mt-1">
                  {formatAutoTimeLine(nextAutoAlarm.wakeup_time)}
                </Text>
              </>
            ) : (
              <Text className="font-pretendard text-white text-xl">
                설정된 자동 알람이 없습니다.
              </Text>
            )}
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
        <TouchableOpacity onPress={handleNewAlarm}>
          <Ionicons name="add-circle-outline" size={38} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 12 }}>
        {myAlarms.length === 0 ? (
          <View>
            <Text className="mt-[40%] text-white text-3xl text-center">
              아직 내 알람이 없습니다!
            </Text>
            <Text className="mt-[5%] text-gray-300 text-xl text-center">
              + 버튼을 눌러 알람을 추가해보세요
            </Text>
          </View>
        ) : (
          <FlatList
            data={myAlarms}
            keyExtractor={(item) => ((item as any).serverId ?? item.id).toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item: alarm }) => (
              <TouchableOpacity
                onPress={() => handleGoToAlarmDetail(alarm)}
                activeOpacity={0.8}
              >
                <View className="h-[5rem] w-[91%] bg-dark border border-dark-stroke rounded-2xl self-center flex-row items-center justify-between px-[4%] mt-4">
                  <View className="flex-row items-center space-x-2">
                    <View className="w-[50%]">
                      <Text
                        className="font-pretendard text-white text-[18px]"
                        style={{
                          ...(Platform.OS === 'web' ? { width: 160 } : {}),
                        }}
                      >
                        {alarm.title}
                      </Text>
                    </View>
                    <Text className="font-pretendard text-white text-xl"> ㅣ </Text>
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
                    onToggle={() => handleToggleAlarm(alarm.id, alarm.isActive)}
                    disabled={false}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </BottomLayout>
  );
}
