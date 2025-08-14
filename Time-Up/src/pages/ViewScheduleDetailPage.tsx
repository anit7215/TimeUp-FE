import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';
import {
  BottomSheetModal,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BellIcon from '../../assets/icons/addSchedulePage/BellIcon.svg';
import CalendarIcon from '../../assets/icons/addSchedulePage/CalendarIcon.svg';
import LocationIcon from '../../assets/icons/addSchedulePage/LocationIcon.svg';
import MemoIcon from '../../assets/icons/addSchedulePage/MemoIcon.svg';
import RepeatIcon from '../../assets/icons/addSchedulePage/RepeatIcon.svg';
import RightArrowIcon from '../../assets/icons/RightArrowIcon.svg';
import StarIcon from '../../assets/icons/StarIcon.svg';

import { getScheduleById, updateSchedule, deleteSchedule } from '../apis/schedule';
import HalfTimeScrollPanel from '../components/common/HalfTimeScrollPanel';
import CustomCalendar from '../components/SetSchedule/CustomCalendar';
import { formatKoreanDate, timeOnly } from '../components/SetSchedule/formatDate';
import { useSchedule } from '../context/ScheduleContext';
import { RootStackParamList } from '../types/navigation';
import { buildRecurrenceSummary } from '../utils/recurrenceSummary';
import { toDraft } from '../helpers/schedule';
import Modal from '../components/common/Modal';
import PageBackButton from '../components/common/PageBackButton';

const { width, height } = Dimensions.get('window');

type ViewScheduleDetailPageRouteProp = {
  scheduleId: string;
};

export default function ViewScheduleDetailPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { scheduleId } = route.params as ViewScheduleDetailPageRouteProp;

  const { state, dispatch } = useSchedule();
  const { view, draft: schedule, loading, error } = state;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [openDelete, setOpenDeleteModal] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '70%'], []);

  const colorOptions = ['#F7A1A1', '#FACA9E', '#FAE39E', '#B9DFBB', '#A5C6F3', '#B6A3F5', '#F8A0DA', '#CCCCCC'];

  const colorMap: Record<string, string> = {
    '#F7A1A1': 'red',
    '#FACA9E': 'orange',
    '#FAE39E': 'yellow',
    '#B9DFBB': 'green',
    '#A5C6F3': 'blue',
    '#B6A3F5': 'purple',
    '#F8A0DA': 'pink',
    '#CCCCCC': 'gray',
  };
  const reverseColorMap: Record<string, string> = {
    red: '#F7A1A1',
    orange: '#FACA9E',
    yellow: '#FAE39E',
    green: '#B9DFBB',
    blue: '#A5C6F3',
    purple: '#B6A3F5',
    pink: '#F8A0DA',
    gray: '#CCCCCC',
  };

  // ---- Load schedule on mount ----
  /*
  useEffect(() => {
    if (!scheduleId) return;

    (async () => {
      try {
        dispatch({ type: 'VIEW_SCHEDULE_REQUEST', payload: { scheduleId } });

        const schedule = await getScheduleById(scheduleId);

        // 서버 원본 보관
        dispatch({ type: 'VIEW_SCHEDULE_SUCCESS', payload: schedule });

        // 드래프트 초기화
        dispatch({ type: 'UPDATE_DRAFT', payload: toDraft(schedule) });

        setCurrentDate(schedule.start_date ?? new Date().toISOString());
      } catch (e: any) {
        dispatch({
          type: 'VIEW_SCHEDULE_FAILURE',
          payload: { error: e?.message ?? '조회 실패' },
        });
        Alert.alert('오류', '스케줄을 불러올 수 없습니다.');
        navigation.goBack();
      }
    })();
  }, [scheduleId, dispatch, navigation]); */
// 디버깅용 useEffect

// 1. 스케줄 로드 함수 분리
const loadSchedule = async () => {
  try {
    console.log('🔄 스케줄 로딩 시작...');
    dispatch({ type: 'VIEW_SCHEDULE_REQUEST', payload: { scheduleId } });

    const apiResponse = await getScheduleById(scheduleId);
    console.log('🔍 API 전체 응답:', apiResponse);

    // 실제 스케줄 데이터 추출
    let actualSchedule = apiResponse;
    if (apiResponse?.success?.schedule) {
      actualSchedule = apiResponse.success.schedule;
    } else if (apiResponse?.schedule) {
      actualSchedule = apiResponse.schedule;
    }

    console.log('🔍 실제 스케줄 데이터:', actualSchedule);
    console.log('🔍 actualSchedule.name:', actualSchedule.name);

    // 서버 원본 보관
    dispatch({ type: 'VIEW_SCHEDULE_SUCCESS', payload: actualSchedule });

    // 드래프트 초기화
    const draftData = toDraft(actualSchedule);
    console.log('🔍 toDraft 결과:', draftData);
    dispatch({ type: 'UPDATE_DRAFT', payload: draftData });

    setCurrentDate(actualSchedule.start_date ?? new Date().toISOString());
    console.log('✅ 스케줄 로딩 완료');
  } catch (e: any) {
    console.error('❌ 스케줄 로드 에러:', e);
    dispatch({
      type: 'VIEW_SCHEDULE_FAILURE',
      payload: { error: e?.message ?? '조회 실패' },
    });
    throw e;
  }
};

// 2. useEffect
useEffect(() => {
  if (!scheduleId) return;

  loadSchedule().catch((error) => {
    console.error('❌ useEffect 에러:', error);
    Alert.alert('오류', '스케줄을 불러올 수 없습니다.');
    navigation.goBack();
  });
}, [scheduleId]);

// 3. 수정 핸들러
const handleUpdate = async () => {
  try {
    console.log('🔄 스케줄 수정 시작...');
    console.log('🔍 수정할 데이터:', schedule);

    // 1. 수정 요청
    const updateResponse = await updateSchedule(scheduleId, schedule);
    console.log('🔍 수정 API 응답:', updateResponse);

    // 2. 수정 후 최신 데이터 다시 로드
    console.log('🔄 수정 후 데이터 다시 로드...');
    await loadSchedule();

    setIsEditing(false);
    Alert.alert('성공', '스케줄이 수정되었습니다.');
    console.log('✅ 스케줄 수정 완료');
  } catch (err: any) {
    console.error('❌ 수정 에러:', err);
    if (err?.response) {
      Alert.alert('서버 응답 오류', err.response.data?.message || '수정에 실패했습니다');
    } else if (err?.request) {
      Alert.alert('요청 실패', '서버로 요청을 보내지 못했습니다');
    } else {
      Alert.alert('에러', err?.message ?? '수정 실패');
    }
  }
};

// 4. 취소 핸들러도 수정
const handleCancelEdit = () => {
  setIsEditing(false);
  // 원본(view) 기준으로 드래프트 복원
  if (state.view) {
    console.log('🔄 편집 취소 - 원본으로 복원');
    dispatch({ type: 'UPDATE_DRAFT', payload: toDraft(state.view) });
  }
};

// 추가: 렌더링 시점의 데이터 상태 확인
console.log('🔍 렌더링 시점 schedule:', schedule);
console.log('🔍 렌더링 시점 schedule.name:', schedule?.name);
console.log('🔍 렌더링 시점 schedule.start_date:', schedule?.start_date);
  // ---- Helpers ----
  const { fullText } = buildRecurrenceSummary(schedule);

  const toInt = (s: string, fallback = 0) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  };
  const convertTo24Hour = (hour12: number, period: '오전' | '오후'): number => {
    const h = hour12 % 12;
    return period === '오전' ? h : h + 12;
  };

  // ---- Actions ----
  /* const handleUpdate = async () => {
    try {
      const updated = await updateSchedule(scheduleId, schedule);

      // 서버 원본/드래프트 동기화
      dispatch({ type: 'VIEW_SCHEDULE_SUCCESS', payload: updated });
      dispatch({ type: 'UPDATE_DRAFT', payload: toDraft(updated) });

      setIsEditing(false);
      Alert.alert('성공', '스케줄이 수정되었습니다.');
    } catch (err: any) {
      console.error('❌ Update Error:', err);
      if (err?.response) {
        Alert.alert('서버 응답 오류', err.response.data?.message || '수정에 실패했습니다');
      } else if (err?.request) {
        Alert.alert('요청 실패', '서버로 요청을 보내지 못했습니다');
      } else {
        Alert.alert('에러', err?.message ?? '수정 실패');
      }
    }
  }; */

  const handleDelete = () => setOpenDeleteModal(true);
  const gotoRemindPage = () => navigation.navigate('SetRemindAlarmPage');
  const gotoRepeatPage = () => navigation.navigate('SetScheduleRepeatPage');
  const gotoLocationPage = () => navigation.navigate('SetLocationPage');

  // ---- Loading / Error ----
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', marginTop: 16 }}>로딩 중...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>오류: {error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={() => {}}
        backgroundStyle={{ backgroundColor: '#33363B' }}
        enableContentPanningGesture={false}
        enableHandlePanningGesture
        keyboardBehavior="interactive"
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          {selectedItem === '일정 이름' && (
            <TextInput
              style={{
                width: '100%',
                height: 50,
                borderColor: '#65696D',
                borderWidth: 1,
                padding: 16,
                borderRadius: 16,
                color: 'white',
                fontSize: 16
              }}
              placeholder="일정 이름 입력"
              placeholderTextColor={'#979B9F'}
              value={schedule.name ?? ''}
              onChangeText={(text) => dispatch({ type: 'UPDATE_DRAFT', payload: { name: text } })}
              editable={isEditing}
            />
          )}

          {selectedItem === '메모' && (
            <TextInput
              style={{
                width: '100%',
                height: 150,
                borderColor: '#65696D',
                borderWidth: 1,
                padding: 16,
                borderRadius: 16,
                color: 'white',
                fontSize: 16
              }}
              placeholder="내용 입력"
              placeholderTextColor={'#979B9F'}
              multiline
              textAlignVertical="top"
              value={schedule.memo ?? ''}
              onChangeText={(text) => dispatch({ type: 'UPDATE_DRAFT', payload: { memo: text } })}
              editable={isEditing}
            />
          )}

          {['시작 날짜', '종료 날짜'].includes(selectedItem || '') && isEditing && (
            <CustomCalendar
              initialDate={currentDate}
              onSelectDate={(initialDate) => {
                setCurrentDate(initialDate);
                dispatch({
                  type: 'UPDATE_DRAFT',
                  payload:
                    selectedItem === '시작 날짜'
                      ? { start_date: initialDate }
                      : { end_date: initialDate },
                });
              }}
            />
          )}

          {['시작 시간', '종료 시간'].includes(selectedItem || '') && isEditing && (
            <HalfTimeScrollPanel
              onTimeChange={(hourStr: string, minuteStr: string, period: string) => {
                const targetField = (selectedItem === '시작 시간' ? 'start_date' : 'end_date') as
                  | 'start_date'
                  | 'end_date';

                const h12 = toInt(hourStr, 0);
                const m = toInt(minuteStr, 0);
                const p: '오전' | '오후' = period === '오전' ? '오전' : '오후';
                const h24 = convertTo24Hour(h12, p);

                const updatedDate = moment(schedule[targetField])
                  .set({ hour: h24, minute: m, second: 0, millisecond: 0 })
                  .format('YYYY-MM-DDTHH:mm:ss');

                dispatch({ type: 'UPDATE_DRAFT', payload: { [targetField]: updatedDate } });
              }}
            />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => {
                bottomSheetModalRef.current?.dismiss();
                setSelectedItem(null);
              }}
            >
              <Text style={{ color: 'white' }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Text style={{ color: 'white' }}>선택</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Page Body */}
          <View style={{ flex: 1, backgroundColor: '#121212', paddingTop: height > 700 ? 30 : 10 }}>


        {/* 제목 + 중요 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            alignItems: 'center',
            marginBottom: height > 700 ? 20 : 10
          }}
        >
          <PageBackButton/>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                setSelectedItem('일정 이름');
                bottomSheetModalRef.current?.present();
              }
            }}
            style={{ flex: 1}}
            disabled={!isEditing}
          >
            <Text
              style={{
                color: 'white',
                fontSize: width > 400 ? 20 : 18,
                lineHeight: width > 400 ? 24 : 22,
                minHeight: 45,
                textAlign: 'left',
                alignSelf: 'center' 
              }}
            >
              {schedule.name || '일정 이름'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                dispatch({ type: 'UPDATE_DRAFT', payload: { is_important: !schedule.is_important } });
              }
            }}
            style={{ marginLeft: 18 }}
            disabled={!isEditing}
          >
            <StarIcon fill={schedule.is_important ? 'white' : 'none'} />
          </TouchableOpacity>
        </View>

        {/* 날짜/시간 */}
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
          <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setSelectedItem('시작 날짜');
                  bottomSheetModalRef.current?.present();
                }
              }}
              disabled={!isEditing}
            >
              <Text style={{ color: 'white', fontSize: width > 400 ? 16 : 14, marginBottom: 8 }}>
                {formatKoreanDate(schedule.start_date)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setSelectedItem('시작 시간');
                  bottomSheetModalRef.current?.present();
                }
              }}
              disabled={!isEditing}
            >
              <Text style={{ color: 'white', fontSize: width > 400 ? 36 : 28 }}>
                {timeOnly(schedule.start_date)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: width > 400 ? 32 : 16 }}>
            <RightArrowIcon fill="white" width={width > 400 ? 24 : 20} height={width > 400 ? 24 : 20} />
          </View>

          <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setSelectedItem('종료 날짜');
                  bottomSheetModalRef.current?.present();
                }
              }}
              disabled={!isEditing}
            >
              <Text style={{ color: 'white', fontSize: width > 400 ? 16 : 14, marginBottom: 8 }}>
                {formatKoreanDate(schedule.end_date)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setSelectedItem('종료 시간');
                  bottomSheetModalRef.current?.present();
                }
              }}
              disabled={!isEditing}
            >
              <Text style={{ color: 'white', fontSize: width > 400 ? 36 : 28 }}>
                {timeOnly(schedule.end_date)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingHorizontal: width > 400 ? 40 : 20 }}>
            {/* 색상 */}
            <View
              style={{
                padding: 16,
                borderWidth: 1,
                borderColor: '#3A3A5F',
                backgroundColor: '#27273E',
                borderRadius: 20,
                width: '100%',
                marginBottom: 16
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <CalendarIcon width={width > 400 ? 20 : 18} height={width > 400 ? 20 : 18} />
                <Text style={{ marginLeft: 8, color: 'white', fontSize: width > 400 ? 14 : 12 }}>색상</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {colorOptions.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (isEditing) {
                        dispatch({ type: 'UPDATE_DRAFT', payload: { color: colorMap[color] } });
                      }
                    }}
                    style={{ marginRight: 12, marginBottom: 8 }}
                    disabled={!isEditing}
                  >
                    <View
                      style={{
                        width: width > 400 ? 32 : 28,
                        height: width > 400 ? 32 : 28,
                        borderRadius: 16,
                        backgroundColor: color,
                        borderWidth: reverseColorMap[schedule.color ?? 'gray'] === color ? 2 : 0,
                        borderColor: 'white'
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 리마인드 / 반복 */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderWidth: 1,
                  borderColor: '#3A3A5F',
                  backgroundColor: '#27273E',
                  borderRadius: 20,
                  marginRight: 8
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <BellIcon width={width > 400 ? 20 : 18} height={width > 400 ? 20 : 18} />
                  <Text style={{ marginLeft: 8, color: 'white', fontSize: width > 400 ? 14 : 12 }}>리마인드</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (isEditing) gotoRemindPage();
                  }}
                  style={{ marginVertical: 16, justifyContent: 'center', alignItems: 'center' }}
                  disabled={!isEditing}
                >
                  <Text style={{ color: 'white', fontSize: width > 400 ? 14 : 12, textAlign: 'center' }}>
                    {schedule.is_reminding ? `${schedule.remind_at ?? 0}분 전` : '알림 설정 안함'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderWidth: 1,
                  borderColor: '#3A3A5F',
                  backgroundColor: '#27273E',
                  borderRadius: 20,
                  marginLeft: 8
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <RepeatIcon width={width > 400 ? 20 : 18} height={width > 400 ? 20 : 18} />
                  <Text style={{ marginLeft: 8, color: 'white', fontSize: width > 400 ? 14 : 12 }}>반복</Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (isEditing) gotoRepeatPage();
                  }}
                  style={{ marginVertical: 16, justifyContent: 'center', alignItems: 'center' }}
                  disabled={!isEditing}
                >
                  <Text style={{ color: 'white', fontSize: width > 400 ? 14 : 12, textAlign: 'center' }}>
                    {fullText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 장소 */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#3A3A5F',
                backgroundColor: '#27273E',
                borderRadius: 20,
                width: '100%',
                marginBottom: 16
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <LocationIcon width={width > 400 ? 20 : 18} height={width > 400 ? 20 : 18} />
                <Text style={{ marginLeft: 8, color: 'white', fontSize: width > 400 ? 14 : 12 }}>장소</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (isEditing) gotoLocationPage();
                }}
                style={{ marginVertical: 16, justifyContent: 'flex-start' }}
                disabled={!isEditing}
              >
                <Text style={{ color: 'white', fontSize: width > 400 ? 18 : 16 }}>
                  {schedule.place_name || '입력'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 메모 */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#3A3A5F',
                backgroundColor: '#27273E',
                borderRadius: 20,
                width: '100%',
                marginBottom: 32
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <MemoIcon width={width > 400 ? 20 : 18} height={width > 400 ? 20 : 18} />
                <Text style={{ marginLeft: 8, color: 'white', fontSize: width > 400 ? 14 : 12 }}>메모</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (isEditing) {
                    setSelectedItem('메모');
                    bottomSheetModalRef.current?.present();
                  }
                }}
                style={{ marginVertical: 16, justifyContent: 'flex-start' }}
                disabled={!isEditing}
              >
                <Text style={{ color: 'white', fontSize: width > 400 ? 18 : 16 }}>
                  {schedule.memo || '입력'}
                </Text>
              </TouchableOpacity>
            </View>
            {openDelete && (
      <Modal
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          try {
            await deleteSchedule(scheduleId);
            setOpenDeleteModal(false);
            Alert.alert('성공', '스케줄이 삭제되었습니다.');
            navigation.navigate('CalendarPage');
          } catch (error: any) {
            console.error('삭제 실패:', error);
            Alert.alert('오류', '스케줄 삭제에 실패했습니다.');
          }
        }}
      >
        {'일정을 삭제하시겠습니까?'}
      </Modal>
    )}

            {/* 하단 버튼 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
                paddingHorizontal: width > 400 ? 20 : 10,
                paddingVertical: height > 700 ? 32 : 16
              }}
            >
              {!isEditing ? ( // 조회 모드
                <>
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={{
                      width: '45%',
                      paddingVertical: 12,
                      borderRadius: 20,
                      alignItems: 'center',
                      backgroundColor: '#1C1F21',
                      marginHorizontal: 6
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: width > 400 ? 16 : 14 }}>삭제</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    style={{
                      width: '45%',
                      paddingVertical: 12,
                      borderRadius: 20,
                      alignItems: 'center',
                      backgroundColor: '#CCCCFF',
                      marginHorizontal: 6
                    }}
                  >
                    <Text style={{ color: 'black', fontSize: width > 400 ? 16 : 14 }}>편집</Text>
                  </TouchableOpacity>
                </>
              ) : ( // 편집 모드
                <>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={{
                      width: '45%',
                      paddingVertical: 12,
                      borderRadius: 20,
                      alignItems: 'center',
                      backgroundColor: '#1C1F21',
                      marginHorizontal: 6
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: width > 400 ? 16 : 14 }}>취소</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleUpdate}
                    style={{
                      width: '45%',
                      paddingVertical: 12,
                      borderRadius: 20,
                      alignItems: 'center',
                      backgroundColor: '#CCCCFF',
                      marginHorizontal: 6
                    }}
                  >
                    <Text style={{ color: 'black', fontSize: width > 400 ? 16 : 14 }}>저장</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}