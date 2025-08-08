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
// import StarIcon from '../../assets/icons/StarIcon.svg';
import { createSchedule } from '../apis/schedule';
import HalfTimeScrollPanel from '../components/common/HalfTimeScrollPanel';
import CustomCalendar from '../components/SetSchedule/CustomCalendar';
import { formatKoreanDate, timeOnly } from '../components/SetSchedule/formatDate';
import { useSchedule } from '../context/ScheduleContext';

const { width, height } = Dimensions.get('window');

export default function AddSchedulePage() {
  const { state, dispatch, addSchedule } = useSchedule();
  const form = state.draft;
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '70%'], []);
  const [currentDate, setCurrentDate] = useState(form.start_date);

  const colorOptions = ["#F7A1A1", "#FACA9E", "#FAE39E", "#B9DFBB", "#A5C6F3", "#B6A3F5", "#F8A0DA", "#CCCCCC"];

  const handleSave = async () => {
    try {
      const token = 'dev-token';
      const savedSchedule = await createSchedule(form, token);
      dispatch({ type: 'RESET_DRAFT' });
      navigation.navigate('CalendarPage', { newSchedule: savedSchedule });
    } catch (err) {
      console.error(err);
      Alert.alert('일정 저장 실패', '네트워크 오류 또는 서버 오류입니다');
    }
  };

  const gotoRemindPage = () => navigation.navigate('SetRemindAlarmPage');
  const gotoRepeatPage = () => navigation.navigate('SetScheduleRepeatPage');
  const gotoLocationPage = () => navigation.navigate('SetLocationPage');
  // 12시간 형식을 24시간 형식으로 변환하는 함수
const convertTo24Hour = (hour: number, period: string): number => {
  if (period === '오전') {
    return hour === 12 ? 0 : hour;
  } else { // PM
    return hour === 12 ? 12 : hour + 12;
  }
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
          onTimeChange={(hour: number, minute: number, period ) => {
            const targetField = selectedItem === '시작 시간' ? 'start_date' : 'end_date';
            const currentDate = moment(form[targetField]);

            const convertedHour = convertTo24Hour(hour, period)

            const updatedDate = currentDate
              .set({ hour: convertedHour, minute, second: 0, millisecond: 0 })
              .format('YYYY-MM-DDTHH:mm:ss'); // 예: 2025-08-01T14:30:00

            console.log('수정된 날짜시간:', updatedDate); // 확인용

            dispatch({
              type: 'UPDATE_DRAFT',
              payload: { [targetField]: updatedDate },
            });
          }}
        />

          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <TouchableOpacity onPress={() => { bottomSheetModalRef.current?.dismiss(); setSelectedItem(null); }}>
              <Text style={{ color: 'white' }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Text style={{ color: 'white' }}>선택</Text>
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
              onPress={() => {
                setSelectedItem("일정 이름")
                bottomSheetModalRef.current?.present()
              }}
              style={{ flex: 1 }}
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
              style={{ marginLeft: 18}}
            >
              {/* <StarIcon 
                fill={form.is_important ? 'white' : 'none'}
              /> */}
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
                     dispatch({ type: 'UPDATE_DRAFT', payload: { color }}) // 선택한 색상을 schedule에 저장
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
                        borderWidth: form.color === color ? 2 : 0,
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
                    {form.is_recurring ? '1주마다' : '반복 설정 안함'}
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
                  navigation.navigate('SetLocationPage') // 폼 객체 보내기. 근데 보낼 필요가 있나 모르겠네
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