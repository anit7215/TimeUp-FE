import { RootStackParamList } from '@/src/types/navigation';
import { ImportantSchedule } from '@/src/types/schedule';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { timeOnly } from './formatDate';
import { Dispatch } from 'react';
import { useSchedule } from '@/src/context/ScheduleContext';
import { getScheduleById } from '../../apis/schedule';
type Navigation = NativeStackNavigationProp<RootStackParamList, 'ViewScheduleDetailPage'>;

interface ImportantScheduleModalProps {
  selectedMonth: string; // "2024-07"
  schedules: ImportantSchedule[]; // 이미 '중요+월'로 필터된 리스트
  isVisible: boolean;
  onClose: () => void;
}

const ImportantScheduleModal: React.FC<ImportantScheduleModalProps> = ({
  selectedMonth,
  schedules,
  isVisible,
  onClose,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['8%', '90%'], []);
  const navigation = useNavigation<Navigation>();

  // ID 필드 유연 처리 (scheduleId | schedule_id)
  const getScheduleId = (s: any) => String(s?.scheduleId ?? s?.schedule_id);

  const { dispatch } = useSchedule();

  // ✅ 추가 필터링 없이 정렬만
  const sortedSchedules = useMemo(
    () =>
      [...(schedules ?? [])].sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      ),
    [schedules]
  );

  const getMonthName = (monthString: string) => {
    const [, month] = monthString.split('-');
    return `${parseInt(month, 10)}월`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={{
        backgroundColor: '#4D4DFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: '#6B6B8D',
        width: 40,
        height: 4,
      }}
    >
      <BottomSheetView className="flex-1 px-4">
        {/* 축소 헤더 */}
        <TouchableOpacity
          className="py-4 border-b border-[#C9CDD1]"
          onPress={() => bottomSheetRef.current?.snapToIndex(1)}
          activeOpacity={0.7}
        >
          <Text className="text-white text-[20px] font-semibold text-center">
            {getMonthName(selectedMonth)}의 중요 일정 모아보기
          </Text>
        </TouchableOpacity>

        {/* 리스트 */}
        <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false}>
          {sortedSchedules.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-[#F7F7FE] text-[24px]">아직 중요 일정이 없습니다!</Text>
              <Text className="text-[#F7F7FE] text-[18px]">캘린더에서 중요한 일정을 표시해보세요</Text>
            </View>
          ) : (
            sortedSchedules.map((schedule) => {
              const id = getScheduleId(schedule);
              return (
                <TouchableOpacity
                  key={id}
                  className="bg-[#F7F7FE] rounded-[20px] p-4 mb-3"
                  activeOpacity={0.7}
                  onPress={async () => {
                    const scheduleData = await getScheduleById(schedule.scheduleId)
                    dispatch({
                      type: 'VIEW_SCHEDULE_SUCCESS',
                      payload: scheduleData
                    })
                    navigation.navigate('ViewScheduleDetailPage', { scheduleId: schedule.scheduleId }) // 타입 에러
                  }}
                >
                  <View className="flex-row items-start">
                    {/* 색상 인디케이터 */}
                    <View
                      className="w-3 self-stretch rounded-[12px] mr-3"
                      style={{ backgroundColor: schedule.color, minHeight: 40 }}
                    />

                    {/* 일정 정보 */}
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-[#000000] font-bold text-[20px]">
                          {formatDate(schedule.start_date)}
                        </Text>

                        <View className="flex-1 ml-5">
                          <Text className="text-black-500 text-[20px] mb-1">
                            {schedule.name}
                          </Text>

                          {schedule.start_date && (
                            <Text className="text-[#000000] text-[16px] ml-2">
                              {timeOnly(schedule.start_date)} - {timeOnly(schedule.end_date)}
                            </Text>
                          )}

                          {/* 장소가 있을 때만 */}
                          {(schedule as any).place_name && (
                            <Text className="text-[#000000] text-[16px]">
                              {(schedule as any).place_name}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ImportantScheduleModal;
