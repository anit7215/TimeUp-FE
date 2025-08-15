import {
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BellIcon from '../../assets/icons/addSchedulePage/BellIcon.svg';
import CalendarIcon from '../../assets/icons/addSchedulePage/CalendarIcon.svg';
import LocationIcon from '../../assets/icons/addSchedulePage/LocationIcon.svg';
import MemoIcon from '../../assets/icons/addSchedulePage/MemoIcon.svg';
import RepeatIcon from '../../assets/icons/addSchedulePage/RepeatIcon.svg';
import RightArrowIcon from '../../assets/icons/RightArrowIcon.svg';
import StarIcon from '../../assets/icons/StarIcon.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createSchedule } from '../apis/schedule';
import HalfTimeScrollPanel from '../components/common/HalfTimeScrollPanel';
import CustomCalendar from '../components/SetSchedule/CustomCalendar';
import { formatKoreanDate, timeOnly } from '../components/SetSchedule/formatDate';
import { useSchedule } from '../context/ScheduleContext';
import { RootStackParamList } from '../types/navigation';
import { buildRecurrenceSummary } from '../utils/recurrenceSummary';

const { width, height } = Dimensions.get('window');

export default function AddSchedulePage() {
  const { state, dispatch } = useSchedule();
  const { fullText } = buildRecurrenceSummary(state.draft);
  const form = state.draft;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '70%'], []);
  const [currentDate, setCurrentDate] = useState(form.start_date);

  const colorOptions = ["#F7A1A1", "#FACA9E", "#FAE39E", "#B9DFBB", "#A5C6F3", "#B6A3F5", "#F8A0DA", "#CCCCCC"];

  const colorMap: Record<string, string> = {
    "#F7A1A1": "red",
    "#FACA9E": "orange",
    "#FAE39E": "yellow",
    "#B9DFBB": "green",
    "#A5C6F3": "blue",
    "#B6A3F5": "purple",
    "#F8A0DA": "pink",
    "#CCCCCC": "gray",
  };
  

const handleSave = async () => {
  const formToSend = {
    ...form,
    start_date: moment(form.start_date).format('YYYY-MM-DDTHH:mm:ss'),
    end_date: moment(form.end_date).format('YYYY-MM-DDTHH:mm:ss'),
  }
  try {
    await createSchedule(formToSend);
    dispatch({ type: 'RESET_DRAFT' });
    navigation.navigate('CalendarPage');
  } catch (err: any) {
    console.error('❌ Axios Error:', err);

    if (err.response) {
      console.log('🔥 status:', err.response.status);
      console.log('🔥 message:', err.response.data); 
      Alert.alert('서버 응답 오류', err.response.data?.message || '입력값을 다시 확인해주세요');
    } else if (err.request) {
      Alert.alert('요청 실패', '서버로 요청을 보내지 못했습니다');
    } else {
      Alert.alert('에러', err.message);
    }
  }
}

  const gotoRemindPage = () => navigation.navigate('SetRemindAlarmPage');
  const gotoRepeatPage = () => navigation.navigate('SetScheduleRepeatPage');
  const gotoLocationPage = () => navigation.navigate('SetLocationPage');

  const toInt = (s: string, fallback = 0) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  };
  
  // 12시간 형식을 24시간 형식으로 변환하는 함수
  const convertTo24Hour = (hour12: number, period: '오전' | '오후'): number => {
    const h = hour12 % 12;              // 12 → 0 보정
    return period === '오전' ? h : h + 12;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
   <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={() => {}}
        backgroundStyle={{ backgroundColor: '#33363B' }}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        keyboardBehavior="interactive"
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          {selectedItem === '일정 이름' && (
            <TextInput
              style={{ width: '100%', height: 50, borderColor: '#65696D', borderWidth: 1, padding: 16, borderRadius: 16, color: 'white', fontSize: 16 }}
              placeholder='일정 이름 입력'
              placeholderTextColor={'#979B9F'}
              value={form.name}
              onChangeText={(text) => dispatch({ type: 'UPDATE_DRAFT', payload: { name: text } })}
                  onSubmitEditing={() => {
                  bottomSheetModalRef.current?.dismiss();
                  setSelectedItem(null);
                  }}
            />
          )}

          {selectedItem === '메모' && (
            <TextInput
              style={{ width: '100%', height: 150, borderColor: '#65696D', borderWidth: 1, padding: 16, borderRadius: 16, color: 'white', fontSize: 16 }}
              placeholder='내용 입력'
              placeholderTextColor={'#979B9F'}
              multiline
              textAlignVertical='top'
              value={form.memo}
              onChangeText={(text) => dispatch({ type: 'UPDATE_DRAFT', payload: { memo: text } })}
            />
          )}

          {['시작 날짜', '종료 날짜'].includes(selectedItem || '') && (
            <CustomCalendar
              initialDate={currentDate}
              onSelectDate = { (initialDate) => {
                setCurrentDate(initialDate);
                dispatch({
                  type: 'UPDATE_DRAFT',
                  payload: selectedItem === '시작 날짜'
                    ? { start_date: initialDate }
                    : { end_date: initialDate },
                });
              }}
            />
          )}

          {['시작 시간', '종료 시간'].includes(selectedItem || '') && (
            <HalfTimeScrollPanel
            onTimeChange={(hourStr: string, minuteStr: string, period: string) => {
              const targetField = (selectedItem === '시작 시간' ? 'start_date' : 'end_date') as
                | 'start_date'
                | 'end_date';

              const h12 = toInt(hourStr, 0);    // '05' → 5
              const m   = toInt(minuteStr, 0);  // '07' → 7
              const p: '오전' | '오후' = period === '오전' ? '오전' : '오후'

              const h24 = convertTo24Hour(h12, p);

              const updatedDate = moment(form[targetField])
                .set({ hour: h24, minute: m, second: 0, millisecond: 0 })
                .format('YYYY-MM-DDTHH:mm:ss');

              dispatch({
                type: 'UPDATE_DRAFT',
                payload: { [targetField]: updatedDate },
    });
  }}
/>

          )}
          <View  className="flex-row mx-2 py-4 rounded-2xl justify-between bg-[#33363B]">
            <TouchableOpacity
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                setSelectedItem(null);
              }}
              className="flex-1 items-center justify-center px-4 py-2 rounded-[20px] bg-[#52565A] mr-4"
            >
              <Text className="text-white text-[18px]">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()}
              className="flex-1 items-center justify-center px-4 py-2 rounded-[20px] bg-[#CCCCFF] ml-4">
              <Text className="text-black text-[18px]">선택</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>


      <View
        style={{
          flex: 1,
          backgroundColor: '#121212',
          paddingTop: height > 700 ? 30 : 10,
        }}
      >

          {/* 제목 입력 + 별 아이콘 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              alignItems: 'center',
              marginBottom: height > 700 ? 20 : 10 
            }}
          >
            <TouchableOpacity
            style={{ flex: 1, 
              marginLeft: 10,
              marginTop: 20, }}
              onPress={() => {
                setSelectedItem("일정 이름")
                bottomSheetModalRef.current?.present()
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: width > 400 ? 20 : 18,
                  lineHeight: width > 400 ? 24 : 22,
                  minHeight: 45,
                  textAlign: 'left',
                }}
              >
                {form.name ? form.name : '일정 이름'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={()=>dispatch({ type: 'UPDATE_DRAFT', payload: { is_important: !form.is_important }})}
              style={{ marginLeft: 18, marginRight: 15}}
            >
              { <StarIcon 
                fill={form.is_important ? 'white' : 'none'}
              /> }
            </TouchableOpacity>
          </View>

          {/* 날짜/시간 선택 */}
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: height > 700 ? 20 : 8,
              marginLeft: 14,
              paddingHorizontal: width > 400 ? 35 : 20,
              paddingVertical: height > 700 ? 15 : 8,
              alignItems: 'center',
              marginBottom: height > 700 ? 30 : 15,
            }}
          >
            <View style={{ 
              flexDirection: 'column', 
              alignItems: 'center',
              flex: 1
            }}>
              <TouchableOpacity onPress={
                () => {setSelectedItem("시작 날짜")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 16 : 14,
                  marginBottom: 8
                }}>
                  {formatKoreanDate(form.start_date)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={
                () => {setSelectedItem("시작 시간")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 36 : 28,
                }}>
                  {timeOnly(form.start_date)}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ marginHorizontal: width > 400 ? 32 : 16 }}>
              <RightArrowIcon 
                fill="white" 
                width={width > 400 ? 24 : 20}
                height={width > 400 ? 24 : 20}
              />
            </View>
            
            <View style={{ 
              flexDirection: 'column', 
              alignItems: 'center',
              flex: 1
            }}>
            <TouchableOpacity onPress={
                () => {setSelectedItem("종료 날짜")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 16 : 14,
                  marginBottom: 8
                }}>
                  {formatKoreanDate(form.end_date)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={
                () => {setSelectedItem("종료 시간")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                }}>
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 36 : 28,
                }}>
                  {timeOnly(form.end_date)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >

          {/* 리스트 + 버튼 */}
          <View style={{ 
            flex: 1,
            paddingHorizontal: width > 400 ? 40 : 20
          }}>
            {/* 색상 선택 */}
            <View style={{
              padding: 16,
              borderWidth: 1,
              borderColor: '#3A3A5F',
              backgroundColor: '#27273E',
              borderRadius: 20,
              width: '100%',
              marginBottom: 16
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <CalendarIcon 
                  width={width > 400 ? 20 : 18}
                  height={width > 400 ? 20 : 18}
                />
                <Text style={{
                  marginLeft: 8,
                  color: 'white',
                  fontSize: width > 400 ? 14 : 12
                }}>
                  색상
                </Text>
              </View>
              
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {colorOptions.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                     dispatch({ type: 'UPDATE_DRAFT', payload: {...form, color: colorMap[color]} }) // 선택한 색상을 schedule에 저장
                      console.log('선택한 색상:', color) // 선택한 색상 확인
                    }}
                    style={{ marginRight: 12, marginBottom: 8 }}
                  >
                    <View
                      style={{
                        width: width > 400 ? 32 : 28,
                        height: width > 400 ? 32 : 28,
                        borderRadius: 16,
                        backgroundColor: color,
                        borderWidth: form.color === colorMap[color] ? 2 : 0,
                        borderColor: 'white'
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* 리마인드 + 반복 */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#3A3A5F',
                backgroundColor: '#27273E',
                borderRadius: 20,
                marginRight: 8
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <BellIcon 
                    width={width > 400 ? 20 : 18}
                    height={width > 400 ? 20 : 18}
                  />
                  <Text style={{
                    marginLeft: 8,
                    color: 'white',
                    fontSize: width > 400 ? 14 : 12
                  }}>
                    리마인드
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => gotoRemindPage()}
                  style={{
                    marginVertical: 16,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: width > 400 ? 14 : 12,
                    textAlign: 'center'
                  }}>
                    {form.is_reminding ? `${form.remind_at}분 전` : '알림 설정 안함'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={{
                flex: 1,
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#3A3A5F',
                backgroundColor: '#27273E',
                borderRadius: 20,
                marginLeft: 8
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <RepeatIcon 
                    width={width > 400 ? 20 : 18}
                    height={width > 400 ? 20 : 18}
                  />
                  <Text style={{
                    marginLeft: 8,
                    color: 'white',
                    fontSize: width > 400 ? 14 : 12
                  }}>
                    반복
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => gotoRepeatPage()}
                  style={{
                    marginVertical: 16,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: width > 400 ? 14 : 12,
                    textAlign: 'center'
                  }}>
                    {fullText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* 장소 */}
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: '#3A3A5F',
              backgroundColor: '#27273E',
              borderRadius: 20,
              width: '100%',
              marginBottom: 16
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <LocationIcon 
                  width={width > 400 ? 20 : 18}
                  height={width > 400 ? 20 : 18}
                />
                <Text style={{
                  marginLeft: 8,
                  color: 'white',
                  fontSize: width > 400 ? 14 : 12
                }}>
                  장소
                </Text>
              </View>

              <TouchableOpacity
                onPress={(() => {
                  navigation.navigate('SetLocationPage')
                })}
                style={{
                  marginVertical: 16,
                  justifyContent: 'flex-start'
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 18 : 16
                }}>
                  {form.place_name || '입력'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 메모 */}
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: '#3A3A5F',
              backgroundColor: '#27273E',
              borderRadius: 20,
              width: '100%',
              marginBottom: 32
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <MemoIcon 
                  width={width > 400 ? 20 : 18}
                  height={width > 400 ? 20 : 18}
                />
                <Text style={{
                  marginLeft: 8,
                  color: 'white',
                  fontSize: width > 400 ? 14 : 12
                }}>
                  메모
                </Text>
              </View>

              <TouchableOpacity
                onPress={(() => {
                  setSelectedItem("메모")
                  bottomSheetModalRef.current?.present() // 모달 오픈
                })}
                style={{
                  marginVertical: 16,
                  justifyContent: 'flex-start'
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 18 : 16
                }}>
                  {form.memo || '입력'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 하단 버튼 */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 24,
              paddingHorizontal: width > 400 ? 40 : 20,
              paddingVertical: height > 700 ? 32 : 16
            }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: '45%',
                  paddingVertical: 12,
                  borderRadius: 20,
                  alignItems: 'center',
                  backgroundColor: '#1C1F21',
                  marginHorizontal: 12
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: width > 400 ? 18 : 16
                }}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSave()}
                style={{
                  width: '45%',
                  paddingVertical: 12,
                  borderRadius: 20,
                  alignItems: 'center',
                  backgroundColor: '#CCCCFF',
                  marginHorizontal: 12
                }}
              >
                <Text style={{
                  color: 'black',
                  fontSize: width > 400 ? 18 : 16
                }}>
                  저장
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
  </GestureHandlerRootView>
  )
}