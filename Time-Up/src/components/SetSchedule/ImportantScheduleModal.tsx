import { getScheduleDetail } from '@/src/apis/scheduleDetail';
import { RootStackParamList } from '@/src/types/navigation';
import { ImportantSchedule } from '@/src/types/schedule';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { timeOnly } from './formatDate';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'ViewScheduleDetailPage'>;

interface ImportantScheduleModalProps {
  selectedMonth: string; // "2024-07" 형태
  schedules: ImportantSchedule[];
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

  // 스냅 포인트 설정: 축소된 상태(텍스트만 보임)와 확장된 상태
  const snapPoints = useMemo(() => ['8%', '90%'], []);

  
  const navigation = useNavigation<Navigation>();

  // 중요 일정만 필터링
  const importantSchedules = useMemo(() => {
    return schedules.filter(schedule => 
      schedule.is_important && 
      schedule.start_date.startsWith(selectedMonth)
    ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }, [schedules, selectedMonth]);

  // 월 이름 변환
  const getMonthName = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return `${parseInt(month)}월`;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  useEffect(() => {
    // isVisible이 true면 첫 번째 스냅 포인트(축소 상태)로 이동
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
        {/* 축소된 상태에서 보이는 헤더 */}
        <TouchableOpacity 
          className="py-4 border-b border-[#C9CDD1]"
          onPress={() => bottomSheetRef.current?.snapToIndex(1)}
          activeOpacity={0.7}
        >
          <Text className="text-white text-[20px] font-semibold text-center">
            {getMonthName(selectedMonth)}의 중요 일정 모아보기
          </Text>
        </TouchableOpacity>

        {/* 일정 리스트 */}
        <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false}>
          {importantSchedules.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-[#F7F7FE] text-[24px]">
                아직 중요 일정이 없습니다!
              </Text>
              <Text className="text-[#F7F7FE] text-[18px]">
                캘린더에서 중요한 일정을 표시해보세요
              </Text>
            </View>
          ) : (
            importantSchedules.map((schedule) => (
              <TouchableOpacity
                key={schedule.scheduleId}
                className="bg-[#F7F7FE] rounded-[20px] p-4 mb-3"
                activeOpacity={0.7}
                onPress={async () => {
                  // 일정 클릭 시 상세 페이지로 이동
                  const scheduleData = await getScheduleDetail(schedule.scheduleId)
                  navigation.navigate('ViewScheduleDetailPage', { schedule: scheduleData });
                  console.log(`Clicked on schedule: ${schedule.scheduleId}`); // 디버깅용
                }}
              >
                <View className="flex-row items-start">
                  {/* 색상 인디케이터 */}
                  <View
                    className="w-3 h-full rounded-[12px] mr-3"
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
                        
                      {schedule.place_name && (
                        <Text className="text-[#000000] text-[16px]">
                          {schedule.place_name}
                        </Text>
                      )}
                      </View>
                    </View>

                  </View>

                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

      </BottomSheetView>
    </BottomSheet>
  );
};

export default ImportantScheduleModal;