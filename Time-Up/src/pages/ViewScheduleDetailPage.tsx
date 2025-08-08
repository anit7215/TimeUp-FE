import {
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BellIcon from '../../assets/icons/addSchedulePage/BellIcon.svg';
import CalendarIcon from '../../assets/icons/addSchedulePage/CalendarIcon.svg';
import LocationIcon from '../../assets/icons/addSchedulePage/LocationIcon.svg';
import MemoIcon from '../../assets/icons/addSchedulePage/MemoIcon.svg';
import RepeatIcon from '../../assets/icons/addSchedulePage/RepeatIcon.svg';
import RightArrowIcon from '../../assets/icons/RightArrowIcon.svg';
// import StarIcon from '../../assets/icons/StarIcon.svg';
import { createSchedule } from '../apis/schedule';
import HalfTimeScrollPanel from '../components/common/HalfTimeScrollPanel';
import { formatKoreanDate, timeOnly } from '../components/SetSchedule/formatDate';
import { Schedule } from '../types/schedule';
  
  
  
  export default function ViewScheduleDetailPage() {
    const route = useRoute();
    const { schedule } = route.params as { schedule: Schedule };
    const { date } = route.params as { date: string }; // 날짜 파라미
    const [form, setForm] = useState<Schedule>({
      scheduleId: '',
      name: schedule?.name || '',
      start_date: schedule?.start_date || '',
      end_date: schedule?.end_date || '',
      place_name: schedule?.place_name || '',
      address: schedule?.address || '',
      color: schedule?.color || '#FFB366',
      memo: schedule?.memo || '',
      is_reminding: schedule?.is_reminding || false,
      remind_at: schedule?.remind_at || 0,
      is_recurring: schedule?.is_recurring || false,
      is_important: schedule?.is_important || false,
      repeat: schedule?.repeat || 'none',
      remind: schedule?.remind || 'none',
    });
    
  
    const colorOptions = ["#F7A1A1", "#FACA9E", "#FAE39E", "#B9DFBB", "#A5C6F3", "#B6A3F5", "#F8A0DA", "#CCCCCC"]
  
    
    const navigation= useNavigation() as any // 이후 프로젝트 안정화 위해 RootStackParamList 타입으로 변경 예정
  
    const [selectedItem, setSelectedItem] = useState<string | null>(null)
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['50%', '50%'], []) // 모달 얼마나 열리는지 설정
    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index)
    }, [])
    const [currentDate, setCurrentDate] = useState(form.start_date)
  
  const handleSave = async () => {
    try {
      // const token = await AsyncStorage.getItem('access_token');
      // if (!token) {
       // Alert.alert('로그인이 필요합니다');
       // return;
      //}
  
      const token = 'dev-token'; // 개발 중에는 임시로 토큰을 하드코딩
  
      // form을 API로 전송
      const savedSchedule = await createSchedule(form, token); // token을 넘기도록 함수 수정해야 함
  
      // CalendarPage로 form 넘기기
      navigation.navigate('CalendarPage', { newSchedule: savedSchedule });
  
    } catch (err) {
      console.error(err);
      Alert.alert('일정 저장 실패', '네트워크 오류 또는 서버 오류입니다');
    }
  };
  
  
  
    return (
    <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={{ backgroundColor: '#33363B' }} // 배경색 설정
            enableContentPanningGesture={false}
            enableHandlePanningGesture={true}
            keyboardBehavior="interactive"
          > 
          <BottomSheetView style={{ flex: 1, padding: 16}}>
              {selectedItem === '일정 이름' && (
                <View>
                  <TextInput
                    className="w-full h-[50px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white"
                    placeholder='일정 이름 입력'
                    placeholderTextColor={"#979B9F"}
                    value={form.name || ''}
                    onChangeText={(text) => {
                      setForm(prev => {
                        return {...prev, name: text}})
                      console.log('일정 이름:', text) // 입력된 일정 이름 확인
                    }}
                  />
                </View>
              )}
  
              {(selectedItem === '메모') && (
                <View>
                  <TextInput className="w-full h-[250px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white"
                  placeholder='내용 입력'
                  placeholderTextColor={"#979B9F"}
                  multiline={true}
                  textAlignVertical='top'
                  value={form.memo}
                  onChangeText={(text) => setForm({ ...form, memo: text })}
                  >
                    
                  </TextInput>
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
                      )
                    }}
  
                    dayComponent={({ date, state }) => {
                      if (!date) return null
  
                      const day = date.day
                      const dateString = date.dateString
                      const dayOfWeek = new Date(dateString).getDay()
                      const isSelected = dateString === currentDate
  
                      const getTextColor = () => {
                        if (state === 'disabled') return 'gray'
                        if (isSelected) return 'white'
                        if (dayOfWeek === 0) return '#FF3B30'
                        if (dayOfWeek === 6) return '#007AFF'
                        return 'white'
                      }
  
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            console.log('Pressed date:', dateString)
                            setCurrentDate(dateString)
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
                      )
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
                    console.log('취소')
                    bottomSheetModalRef.current?.dismiss() // 모달 닫기
                    setSelectedItem(null) // 선택된 아이템 초기화
                    
                  }
                  }
                  className="w-[48%] bg-transparent py-3 rounded-lg items-center "
                >
                  <Text className="text-white text-base text-[18px]">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('선택')
                    bottomSheetModalRef.current?.dismiss();
                  }
                }
                  className="w-[48%] bg-transparent py-3 rounded-lg items-center"
                >
                  <Text className="text-white text-base text-[18px]">선택</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
  
        <View
          style={{
            flex: 1,
            backgroundColor: '#121212',
            paddingTop: 63,
          }}
        >
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
                setSelectedItem("일정 이름")
                bottomSheetModalRef.current?.present()
              }}>
              <Text
                style={{
                  color: 'white',
                  height: 45,
                  fontSize: 20,
                  lineHeight: 24,
                }}
              >
                {form.name ? form.name : '일정 이름'} {/* ✨ 기본값 처리 */}
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={()=>{setForm({...form, is_important: !form.is_important})}
  
          }>
              {/* <StarIcon fill={form.is_important ? 'white' : 'none'}/> */}
            </TouchableOpacity>
          </View>
  
          {/* 날짜/시간 선택 */}
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 50,
              marginLeft: 16,
              padding: 50,
              alignContent: 'center',
            }}
          >
            <View className="flex-col space-between items-center">
              <TouchableOpacity onPress={
                () => {setSelectedItem("시작 날짜")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text className="text-white h-[32px]">{formatKoreanDate(form.start_date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={
                () => {setSelectedItem("시작 시간")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text className="text-white h-[50px] text-[36px]">{timeOnly(form.start_date)}</Text>
              </TouchableOpacity>
            </View>
            <View className="m-8">
              <RightArrowIcon fill="white" />
            </View>
            <View className="flex-col space-between items-center justify-center">
            <TouchableOpacity onPress={
                () => {setSelectedItem("종료 날짜")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text className="text-white h-[32px]">{formatKoreanDate(form.end_date)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={
                () => {setSelectedItem("종료 시간")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text className="text-white h-[50px] text-[36px]">{timeOnly(form.end_date)}</Text>
              </TouchableOpacity>
            </View>
          </View>
  
          {/* 리스트 + 버튼 */}
          <View className="flex-col flex-1
          
          ">
            <View className="flex-col justify-between items-center px-10">
              <View className="flex-col p-4 border border-[#3A3A5F] bg-[#27273E] rounded-[20px] w-full">
                <View className="flex-row items-center mb-3">
                  <CalendarIcon />
                  <Text className="ml-2 text-white text-[14px]">색상</Text>
                </View>
                
                <View className="flex-row flex-wrap justify-center items-center">
                  {colorOptions.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setForm({ ...form, color }) // 선택한 색상을 schedule에 저장
                        console.log('선택한 색상:', color) // 선택한 색상 확인
                      }}
                    >
                      <View
                        className={`w-[32px] h-[32px] rounded-full mr-3 mb-2 ${
                          form.color === color ? 'border-2 border-white' : 'border-0'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className="flex-row">
                <View className="flex-col px-4 py-4 border border-[#3A3A5F] bg-[#27273E] rounded-[20px] p-3 w-1/2 m-2">
                  <View className="flex-row items-center mb-3">
                    <BellIcon />
                    <Text className="ml-2 text-white text-[14px]">리마인드</Text>
                  </View>
  
                  <TouchableOpacity
                    onPress={(() => {
                      navigation.navigate('SetRemindAlarmPage', {form: form, setForm: setForm}) // 폼 객체 보내기. 근데 보낼 필요가 있나 모르겠네
                    })}
                    className="m-4 justify-center items-center"
                    >
                    <Text className="text-white text-[14px]">{form.is_reminding ? '알림 설정됨' : '알림 설정 안함'}</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-col px-4 py-4 border border-[#3A3A5F] bg-[#27273E] rounded-[20px] p-3 w-1/2 my-2">
                  <View className="flex-row items-center mb-3">
                    <RepeatIcon />
                    <Text className="ml-2 text-white text-[14px]">반복</Text>
                  </View>
  
                  <TouchableOpacity
                    onPress={(() => {
                      navigation.navigate('SetScheduleRepeatPage') // 폼 객체 보내기. 근데 보낼 필요가 있나 모르겠네
                    })}
                    className="m-4 justify-center items-center"
                    >
                    <Text className="text-white text-[14px]">{form.is_reminding ? '반복 설정함' : '반복 설정 안함'}</Text>
                    </TouchableOpacity>
                </View>
  
  
              </View>
              
              <View className="flex-col px-4 py-4 border border-[#3A3A5F] bg-[#27273E] rounded-[20px] p-3 w-full mb-2">
                  <View className="flex-row items-center mb-3">
                    <LocationIcon />
                    <Text className="ml-2 text-white text-[14px]">장소</Text>
                  </View>
  
                  <TouchableOpacity
                    onPress={(() => {
                      navigation.navigate('SetLocationPage', {form: form, setForm: setForm}) // 폼 객체 보내기. 근데 보낼 필요가 있나 모르겠네
                    })}
                    className="m-4 justify-start"
                    >
                    <Text className="text-white text-[18px]">{form.place_name || '입력'}</Text>
                    </TouchableOpacity>
                </View>
  
  
              <View className="flex-col px-4 py-4 border border-[#3A3A5F] bg-[#27273E] rounded-[20px] p-3 w-full">
                  <View className="flex-row items-center mb-3">
                    <MemoIcon />
                    <Text className="ml-2 text-white text-[14px]">메모</Text>
                  </View>
  
                  <TouchableOpacity
                    onPress={(() => {
                      setSelectedItem("메모")
                      bottomSheetModalRef.current?.present() // 모달 오픈
                    })}
                    className="m-4 justify-start"
                    >
                    <Text className="text-white text-[18px]">{form.memo || '입력'}</Text>
                    </TouchableOpacity>
              </View>
  
              {/* 하단 버튼 */}
              <View className="flex-row justify-between mt-6 px-10 py-8">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="w-[48%] bg-transparent py-3 rounded-lg items-center "
                >
                  <Text className="text-white text-[18px]">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSave()}
                  className="w-[48%] bg-transparent py-3 rounded-lg items-center"
                >
                  <Text className="text-white text-[18px]">저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
    </GestureHandlerRootView>
    )
  }