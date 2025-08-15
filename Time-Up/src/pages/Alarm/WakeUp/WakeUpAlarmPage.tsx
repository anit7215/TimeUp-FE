// src/pages/WakeUpAlarmPage.tsx
// 자동알람 - 기상알람 페이지
import { axiosInstance } from '@/src/apis/axiosInstance';
import { GetAllAlarmsResponse } from '@/src/types/alarm';
import { formatTime } from '@/src/utils/AlarmFormat';
import { getAccessToken } from '@/src/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BottomLayout from '../../../Layouts/BottomLayout';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import { Day, useAlarmContext } from '../../../contexts/AlarmContext';
import useAppNavigation from '../../../hooks/useAppNavigation';

const weekdays: Day[] = ['월', '화', '수', '목', '금', '토', '일'];

export default function WakeUpAlarmPage() {
  const navigation = useAppNavigation();
  const { setSelectedDay, weekdaySwitchStates, setWeekdaySwitchStates, autoAlarmOn, setAutoAlarmOn, wakeupAlarms, setSelectedAlarmId, autoAlarms } = useAlarmContext();

  const dayToIndex: Record<Day, number> = {
    '일': 0, '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6,
  };

  useEffect(() => {
    console.log('전체 기상 알람 (wakeupAlarms):', wakeupAlarms);
  }, [wakeupAlarms]); // 상태가 바뀔 때마다 출력

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
    // wakeup_time 기준 오름차순 정렬 후 첫 번째 사용
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

  const handleToggleSwitchForDay = (day: Day) => {
    setWeekdaySwitchStates(prev => {
      const next = { ...prev, [day]: !prev[day] };
      console.log(`${day} 기상알람이 ${next[day] ? '켜졌습니다' : '꺼졌습니다'}.`);
      return next;
    });
  };

  const handleMyPage = () => {
    console.log('내 알람 페이지로 이동합니다.');
    navigation.navigate('MyAlarmPage');
  };

  const handleDetailPage = (day: Day) => {
    const alarm = wakeupAlarms.find(a => a.date.dayOfWeek === day);

    if (!alarm) {
      console.warn(`${day}요일에 대한 기상 알람이 없습니다.`);
      return;
    }

    setSelectedDay(day);             // 요일 상태 저장
    setSelectedAlarmId(alarm.id);    // wakeup_alarm_id 저장
    console.log(`${day} 기상알람 디테일 페이지로 이동합니다.`);
    navigation.navigate('WakeUpAlarmDetailPage');
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
        <Text className="font-pretendard text-[24px] mr-4 text-white font-semibold">
          기상 알람
        </Text>
        <Text className="font-pretendard text-[24px] text-gray-300" onPress={handleMyPage}>
          내 알람
        </Text>
      </View>
      <View className="flex-row items-start mt-2">
        <View className="h-[2px] w-[21%] bg-white ml-[4%]" />
        <View className="h-[2px] w-[15%] bg-black ml-[4%]" />
      </View>

      <View className="mt-3">
        {weekdays.map((day) => {
          const alarm = wakeupAlarms.find((a) => a.date.dayOfWeek === day);
          const formattedTime = alarm ? formatTime(alarm.time) : '오전 08 : 00';

          return (
            <TouchableOpacity
              key={day}
              onPress={() => handleDetailPage(day)}
              activeOpacity={0.7}
            >
              <View className="h-14 w-[91%] bg-dark border border-dark-stroke rounded-full self-center flex-row items-center justify-between px-[5%] mt-4">
                <View className="flex-row items-center gap-x-2 flex-nowrap overflow-hidden">
                  <Text className="font-pretendard text-white text-xl">{day}요일</Text>
                  <Text className="font-pretendard text-white text-xl">   ㅣ   </Text>
                  <Text className="font-pretendard text-white text-xl">{formattedTime}</Text>
                </View>
                <ToggleSwitch
                  isOn={weekdaySwitchStates[day]}
                  onToggle={() => handleToggleSwitchForDay(day)}
                  disabled={false}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomLayout>
  );
}