import {
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PageBackButton from '@/src/components/common/PageBackButton';
import StarIcon from '../../assets/icons/StarIcon.svg';
import HalfTimeScrollPanel from '../../components/common/HalfTimeScrollPanel';
  
  // API 응답 타입 정의
  interface ScheduleDetail {
    schedule_id: number;
    name: string;
    start_date: string;
    end_date: string;
    place_name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    color: string;
    memo?: string;
    is_reminding: boolean;
    remind_at?: number;
    is_recurring: boolean;
    is_important: boolean;
  }
  
  interface ApiResponse {
    result: string;
    status: number;
    success: {
      message: string;
      schedule: ScheduleDetail;
    };
    error: null;
  }
  
  export default function ScheduleDetailEditPage() {
    const route = useRoute();
    const scheduleId = (route.params as any)?.scheduleId; // 라우트에서 일정 ID 받아오기
    
    const [schedule, setSchedule] = useState({
      id: 0,
      title: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      color: '#F7A1A1',
      memo: '',
      isImportant: false,
      repeat: '',
      remind: '',
      placeName: '',
      address: '',
      latitude: 0,
      longitude: 0,
    });
  
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  
    const colorOptions = ["#F7A1A1", "#FACA9E", "#FAE39E", "#B9DFBB", "#A5C6F3", "#B6A3F5", "#F8A0DA", "#CCCCCC"];
    
    // 색상 한글명을 hex 코드로 변환하는 함수
    const colorNameToHex = (colorName: string) => {
      const colorMap: { [key: string]: string } = {
        '빨': '#F7A1A1',
        '주': '#FACA9E', 
        '노': '#FAE39E',
        '초': '#B9DFBB',
        '파': '#A5C6F3',
        '보': '#B6A3F5',
        '분': '#F8A0DA',
        '회': '#CCCCCC'
      };
      return colorMap[colorName] || '#F7A1A1';
    };
  
    const navigation = useNavigation() as any;
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%', '50%'], []);
    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  
    // API에서 일정 상세 정보 가져오기
    const fetchScheduleDetail = async () => {
      try {
        setLoading(true);
        // 실제 API 엔드포인트로 교체해야 함
        const response = await fetch(`YOUR_API_ENDPOINT/schedule/${scheduleId}`);
        const data: ApiResponse = await response.json();
        
        if (data.result === 'Success') {
          const scheduleData = data.success.schedule;
          
          // 시작일과 종료일 파싱
          const startDateTime = moment(scheduleData.start_date);
          const endDateTime = moment(scheduleData.end_date);
          
          setSchedule({
            id: scheduleData.schedule_id,
            title: scheduleData.name,
            startDate: startDateTime.format('YYYY-MM-DD'),
            endDate: endDateTime.format('YYYY-MM-DD'),
            startTime: startDateTime.format('HH:mm'),
            endTime: endDateTime.format('HH:mm'),
            color: colorNameToHex(scheduleData.color),
            memo: scheduleData.memo || '',
            isImportant: scheduleData.is_important,
            repeat: scheduleData.is_recurring ? '매일' : '반복 없음', // 실제로는 더 상세한 반복 정보가 필요
            remind: scheduleData.is_reminding ? `${scheduleData.remind_at}분 전` : '알림 없음',
            placeName: scheduleData.place_name || '',
            address: scheduleData.address || '',
            latitude: scheduleData.latitude || 0,
            longitude: scheduleData.longitude || 0,
          });
          
          setCurrentDate(startDateTime.format('YYYY-MM-DD'));
        } else {
          Alert.alert('오류', '일정 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('일정 상세 정보 조회 오류:', error);
        Alert.alert('오류', '네트워크 연결을 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };
  
    // 일정 수정 API 호출
    const updateSchedule = async () => {
      try {
        const updateData = {
          name: schedule.title,
          start_date: moment(`${schedule.startDate} ${schedule.startTime}`).toISOString(),
          end_date: moment(`${schedule.endDate} ${schedule.endTime}`).toISOString(),
          color: schedule.color,
          memo: schedule.memo,
          is_important: schedule.isImportant,
          // 추가 필드들도 필요에 따라 포함
        };
  
        const response = await fetch(`YOUR_API_ENDPOINT/schedule/${schedule.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
  
        const data = await response.json();
        
        if (data.result === 'Success') {
          Alert.alert('성공', '일정이 수정되었습니다.', [
            { text: '확인', onPress: () => navigation.goBack() }
          ]);
        } else {
          Alert.alert('오류', '일정 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('일정 수정 오류:', error);
        Alert.alert('오류', '네트워크 연결을 확인해주세요.');
      }
    };
  
    // 일정 삭제 API 호출
    const deleteSchedule = async () => {
      Alert.alert(
        '일정 삭제',
        '정말로 이 일정을 삭제하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '삭제',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await fetch(`YOUR_API_ENDPOINT/schedule/${schedule.id}`, {
                  method: 'DELETE',
                });
                
                const data = await response.json();
                
                if (data.result === 'Success') {
                  Alert.alert('성공', '일정이 삭제되었습니다.', [
                    { text: '확인', onPress: () => navigation.goBack() }
                  ]);
                } else {
                  Alert.alert('오류', '일정 삭제에 실패했습니다.');
                }
              } catch (error) {
                console.error('일정 삭제 오류:', error);
                Alert.alert('오류', '네트워크 연결을 확인해주세요.');
              }
            }
          }
        ]
      );
    };
  
    useEffect(() => {
      if (scheduleId) {
        fetchScheduleDetail();
      }
    }, [scheduleId]);
  
    // 로딩 중일 때
    if (loading) {
      return (
        <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>일정 정보를 불러오는 중...</Text>
        </View>
      );
    }
  
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: '#33363B' }}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          keyboardBehavior="interactive"
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            {selectedItem === '일정 이름' && (
              <View>
                <TextInput
                  className="w-full h-[50px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white"
                  placeholder='일정 이름 입력'
                  placeholderTextColor={"#979B9F"}
                  value={schedule.title || ''}
                  onChangeText={(text) => {
                    setSchedule({ ...schedule, title: text });
                    console.log('일정 이름:', text);
                  }}
                  editable={isEditing}
                />
              </View>
            )}
  
            {selectedItem === '색상' && (
              <View className="flex-row flex-wrap w-full justify-center">
                {colorOptions.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isEditing) {
                        setSchedule({ ...schedule, color });
                        console.log('선택한 색상:', color);
                      }
                    }}
                    className="w-1/4 p-[20px] items-center justify-center"
                  >
                    <View
                      className={`w-[60px] h-[60px] rounded-full ${
                        schedule.color === color ? 'border-2 border-white' : 'border-0'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
  
            {selectedItem === '메모' && (
              <View>
                <TextInput
                  className="w-full h-[250px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white"
                  placeholder='내용 입력'
                  placeholderTextColor={"#979B9F"}
                  multiline={true}
                  textAlignVertical='top'
                  value={schedule.memo}
                  onChangeText={(text) => setSchedule({ ...schedule, memo: text })}
                  editable={isEditing}
                />
              </View>
            )}
  
            {(selectedItem === '시작 날짜' || selectedItem === '종료 날짜') && (
              <View>
                <Calendar
                  key={currentDate}
                  current={currentDate}
                  theme={{
                    calendarBackground: '#33363B',
                    textDisabledColor: 'gray',
                  }}
                  markedDates={{
                    [currentDate]: {
                      selected: true,
                      selectedColor: 'blue',
                    },
                  }}
                  renderHeader={(date) => {
                    return (
                      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                        {moment(date).format('M월 YYYY')}
                      </Text>
                    );
                  }}
                  dayComponent={({ date, state }) => {
                    if (!date) return null;
  
                    const day = date.day;
                    const dateString = date.dateString;
                    const dayOfWeek = new Date(dateString).getDay();
                    const isSelected = dateString === currentDate;
  
                    const getTextColor = () => {
                      if (state === 'disabled') return 'gray';
                      if (isSelected) return 'white';
                      if (dayOfWeek === 0) return '#FF3B30';
                      if (dayOfWeek === 6) return '#007AFF';
                      return 'white';
                    };
  
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (isEditing) {
                            console.log('Pressed date:', dateString);
                            setCurrentDate(dateString);
                            // 선택한 날짜를 시작일 또는 종료일에 저장
                            if (selectedItem === '시작 날짜') {
                              setSchedule({ ...schedule, startDate: dateString });
                            } else {
                              setSchedule({ ...schedule, endDate: dateString });
                            }
                          }
                        }}
                      >
                        <View
                          className={`w-10 h-10 justify-center items-center rounded-full ${
                            isSelected ? 'bg-blue-600' : ''
                          }`}
                        >
                          <Text style={{ color: getTextColor(), fontSize: 16 }}>{day}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
  
            {(selectedItem === '시작 시간' || selectedItem === '종료 시간') && (
              <View className="items-center justify-center">
                <HalfTimeScrollPanel />
              </View>
            )}
  
            <View className="flex-row justify-between mt-6 px-10 py-8">
              <TouchableOpacity
                onPress={() => {
                  console.log('취소');
                  bottomSheetModalRef.current?.dismiss();
                  setSelectedItem(null);
                }}
                className="w-[48%] bg-transparent py-3 rounded-lg items-center"
              >
                <Text className="text-white text-base text-[18px]">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('선택');
                  bottomSheetModalRef.current?.dismiss();
                }}
                className="w-[48%] bg-transparent py-3 rounded-lg items-center"
              >
                <Text className="text-white text-base text-[18px]">선택</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
  
        <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: 63 }}>
          {/* 상단 헤더 - 편집 모드 토글 버튼 추가 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: 'white', fontSize: 16 }}>← 뒤로</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={{ color: '#007AFF', fontSize: 16 }}>
                {isEditing ? '완료' : '편집'}
              </Text>
            </TouchableOpacity>
          </View>
  
          {/* 제목 입력 + 별 아이콘 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 2,
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setSelectedItem("일정 이름");
                  bottomSheetModalRef.current?.present();
                }
              }}
              disabled={!isEditing}
            >
              <Text
                style={{
                  color: 'white',
                  height: 45,
                  fontSize: 20,
                  lineHeight: 24,
                }}
              >
                {schedule.title || '일정 이름'}
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity 
              onPress={() => {
                if (isEditing) {
                  setSchedule({ ...schedule, isImportant: !schedule.isImportant });
                }
              }}
              disabled={!isEditing}
            >
              <StarIcon fill={schedule.isImportant ? 'white' : 'none'} />
            </TouchableOpacity>
          </View>
  
          {/* 날짜/시간 표시 */}
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 50,
              marginLeft: 16,
              padding: 136,
              alignContent: 'center',
            }}
          >
            <View className="flex-col space-between items-center">
              <TouchableOpacity 
                onPress={() => {
                  if (isEditing) {
                    setSelectedItem("시작 날짜");
                    bottomSheetModalRef.current?.present();
                  }
                }}
                disabled={!isEditing}
              >
                <Text className="text-white h-[32px]">
                  {moment(schedule.startDate).format('M월 D일 (dd)')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  if (isEditing) {
                    setSelectedItem("시작 시간");
                    bottomSheetModalRef.current?.present();
                  }
                }}
                disabled={!isEditing}
              >
                <Text className="text-white h-[50px] text-[36px]">
                  {schedule.startTime}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="m-8">
              <PageBackButton />
            </View>
            <View className="flex-col space-between items-center justify-center">
              <TouchableOpacity 
                onPress={() => {
                  if (isEditing) {
                    setSelectedItem("종료 날짜");
                    bottomSheetModalRef.current?.present();
                  }
                }}
                disabled={!isEditing}
              >
                <Text className="text-white h-[32px]">
                  {moment(schedule.endDate).format('M월 D일 (dd)')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  if (isEditing) {
                    setSelectedItem("종료 시간");
                    bottomSheetModalRef.current?.present();
                  }
                }}
                disabled={!isEditing}
              >
                <Text className="text-white h-[50px] text-[36px]">
                  {schedule.endTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
  
          {/* 리스트 */}
          <View className="flex-col flex-1 bg-[#1C1F21]">
            <View className="flex-col flex-1 justify-between">
              {[
                { label: '색상', value: '', type: 'color' },
                { label: '장소', value: schedule.placeName, type: 'text' },
                { label: '반복', value: schedule.repeat, type: 'text' },
                { label: '리마인드', value: schedule.remind, type: 'text' },
                { label: '메모', value: schedule.memo, type: 'bottomsheet' },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    if (isEditing) {
                      if (item.type === 'bottomsheet' || item.type === 'color') {
                        setSelectedItem(item.label);
                        bottomSheetModalRef.current?.present();
                      } else if (item.label === '장소') {
                        navigation.navigate('SetLocationPage', {
                          onSelect: (locationData: any) => {
                            setSchedule({
                              ...schedule,
                              placeName: locationData.placeName,
                              address: locationData.address,
                              latitude: locationData.latitude,
                              longitude: locationData.longitude,
                            });
                          },
                          currentValue: {
                            placeName: schedule.placeName,
                            address: schedule.address,
                            latitude: schedule.latitude,
                            longitude: schedule.longitude,
                          },
                        });
                      } else if (item.label === '반복') {
                        navigation.navigate('SetScheduleRepeatPage', {
                          onSelect: (repeatValue: string) => {
                            setSchedule({ ...schedule, repeat: repeatValue });
                          },
                          currentValue: schedule.repeat,
                        });
                      } else if (item.label === '리마인드') {
                        navigation.navigate('SetRemindAlarmPage', {
                          onSelect: (remindValue: string) => {
                            setSchedule({ ...schedule, remind: remindValue });
                          },
                          currentValue: schedule.remind,
                        });
                      }
                    }
                  }}
                  className="flex-row justify-between items-center py-5 px-4 pt-10"
                  disabled={!isEditing}
                  style={{ opacity: isEditing ? 1 : 0.7 }}
                >
                  <Text className="text-white text-[16px] pl-3">{item.label}</Text>
                  {item.type === 'color' ? (
                    <View
                      style={{ backgroundColor: schedule.color }}
                      className="w-5 h-5 rounded-full p-5 ml-3 mr-2"
                    />
                  ) : (
                    <Text className="text-[#C9CDD1] text-[15px] pr-3">
                      {item.value || (isEditing ? '입력' : '없음')}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
  
              {/* 하단 버튼 */}
              <View className="flex-row justify-between mt-6 px-10 py-8">
                {isEditing ? (
                  <>
                    <TouchableOpacity
                      onPress={deleteSchedule}
                      className="w-[30%] bg-red-600 py-3 rounded-lg items-center"
                    >
                      <Text className="text-white text-[18px]">삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsEditing(false)}
                      className="w-[30%] bg-transparent py-3 rounded-lg items-center"
                    >
                      <Text className="text-white text-[18px]">취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={updateSchedule}
                      className="w-[30%] bg-blue-600 py-3 rounded-lg items-center"
                    >
                      <Text className="text-white text-[18px]">저장</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      className="w-[48%] bg-transparent py-3 rounded-lg items-center"
                    >
                      <Text className="text-white text-[18px]">닫기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsEditing(true)}
                      className="w-[48%] bg-blue-600 py-3 rounded-lg items-center"
                    >
                      <Text className="text-white text-[18px]">편집</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }