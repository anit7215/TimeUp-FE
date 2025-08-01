// src/pages/EditMyAlarmPage.tsx
import AlarmButton from '@/src/components/alarm/AlarmButton';
import HalfTimeScrollPanel from '@/src/components/common/HalfTimeScrollPanel';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import type { AlarmItem } from '@/src/types/alarm';
import { formatDate } from '@/src/utils/AlarmFormat';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import useAppNavigation from '../../hooks/useAppNavigation';
import BottomLayout from '../../Layouts/BottomLayout';

import IconBiv from '../../../assets/images/AlarmBiv.svg';
import IconMemo from '../../../assets/images/AlarmMemo.svg';
import IconMusic from '../../../assets/images/AlarmMusic.svg';
import IconRepeat from '../../../assets/images/AlarmRepeat.svg';

export default function EditMyAlarmPage() {
  const navigation = useAppNavigation();
  const [on, setOn] = useState(false);
  const { height } = Dimensions.get('window');
  const { selectedAlarmId, myAlarms, setMyAlarms, selectedAlarmDate, setSelectedAlarmDate, updateAlarmField, } = useAlarmContext();
  const [currentDate, setCurrentDate] = useState(selectedAlarmDate);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%'], [])
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const handleToggleSwitch = useCallback(() => {
    setOn((prev) => !prev);
  }, [])

  const alarmToEdit = myAlarms.find(a => a.id === selectedAlarmId);

  // 테스트 초기값 설정. 알람 상세 설정 상태 관리 구현 후 제거하기.
  // 제목, 시간, 날짜, 사운드, 진동, 반복, 메모 구현 완료. 알람 온오프 상태 관리 추가 필요.
  const [title, setTitle] = useState(alarmToEdit?.title ?? '');
  const [time, setTime] = useState<AlarmItem['time']>(
    alarmToEdit?.time ?? { period: '오전', hour: 7, minute: 0 }
  );
  const [date, setDate] = useState<AlarmItem['date']>(
    alarmToEdit?.date ?? { fullDate: '2025-06-30', dayOfWeek: '월' }
  );
  const [repeat, setRepeat] = useState(alarmToEdit?.repeat ?? '10분, 5회');
  const [memo, setMemo] = useState(alarmToEdit?.memo ?? '');
  const [isActive, setIsActive] = useState(alarmToEdit?.isActive ?? true);

  const handleCancel = () => {
    console.log(`${title} 알람 편집을 취소합니다`);
    navigation.goBack();
  };

  const handleSave = () => {
    console.log('내 알람을 저장합니다.');

    if (selectedAlarmId) {
      // 기존 알람 수정
      updateAlarmField(selectedAlarmId, 'title', title);
      updateAlarmField(selectedAlarmId, 'time', time);
      updateAlarmField(selectedAlarmId, 'date', date);
      updateAlarmField(selectedAlarmId, 'memo', memo);
      updateAlarmField(selectedAlarmId, 'isActive', isActive);
      navigation.navigate('MyAlarmDetailPage');
    } else {
      // 새 알람 생성
      const newAlarm: AlarmItem = {
        id: Date.now(),
        title,
        time,
        date,
        sound: '선택',
        vibrate: 'Basic Ring',
        repeat: '10분, 5회',
        memo,
        isActive: true,
      };
      setMyAlarms((prev) => [...prev, newAlarm]);
      navigation.navigate('MyAlarmPage');
    }
  };

  const handleSelectSound = () => {
    navigation.navigate('SelectAlarmSoundPage');
  };

  const handleSelectVibrate = () => {
    navigation.navigate('SelectAlarmVibratePage');
  };

  const handleSelectReplay = () => {
    navigation.navigate('SelectAlarmReplayPage');
  };

  const handleModalCancel = () => {
    bottomSheetModalRef.current?.dismiss(); // 바텀시트 닫기
    setSelectedItem(null); // 선택 항목 초기화
  };

  const handleModalSelect = () => {
    if (!currentDate) return;
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(currentDate).getDay()];
    setDate({ fullDate: currentDate, dayOfWeek });
    setSelectedAlarmDate(currentDate);
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(null);
    console.log(`날짜 선택됨: ${currentDate} (${dayOfWeek})`);
  };

  const handleTimeCancel = () => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(null);
    console.log('시간 선택 취소됨');
  };

  const handleTimeSelect = () => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(null);
    console.log(`시간 선택됨: ${time.period} ${String(time.hour).padStart(2, '0')}시 ${String(time.minute).padStart(2, '0')}분`);
  };


  const handleMemoCancel = () => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(null);
    console.log(`메모 취소됨`);
  };

  const handleMemoSave = () => {
    bottomSheetModalRef.current?.dismiss();
    setSelectedItem(null);
    console.log(`메모 저장됨: ${memo}`);
  };

  useEffect(() => {
    if (selectedAlarmDate) {
      const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][
        new Date(selectedAlarmDate).getDay()
      ];

      setDate({ fullDate: selectedAlarmDate, dayOfWeek });
    }
  }, [selectedAlarmDate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomLayout>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: '#33373B' }} // 배경색 설정
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          keyboardBehavior="interactive"
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            {selectedItem === '날짜' && (
              <View>
                <Calendar
                  key={currentDate}
                  current={currentDate}
                  theme={{
                    calendarBackground: '#33373B',
                    textDisabledColor: 'gray',
                  }}

                  renderHeader={(date) => {
                    return (
                      <Text style={{ color: 'white', fontSize: 20, fontWeight: '500', textAlign: 'center' }}>
                        {moment(date).format('YYYY년 M월')}
                      </Text>
                    )
                  }}

                  dayComponent={({ date }) => {
                    if (!date) return null

                    const day = date.day
                    const dateString = date.dateString
                    const dayOfWeek = new Date(dateString).getDay()
                    const isSelected = dateString === currentDate


                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (dateString === currentDate) {
                            console.log('이미 선택된 날짜입니다. 중복 요청을 방지합니다.');
                            return;
                          }
                          console.log('Pressed date:', dateString);
                          setCurrentDate(dateString);
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: isSelected ? '#FFFFFF' : 'transparent',
                          }}
                        >
                          <Text
                            style={{
                              color:
                                dayOfWeek === 0
                                  ? '#FF3B30'
                                  : dayOfWeek === 6
                                    ? '#007AFF'
                                    : '#FFFFFF',
                              fontWeight: isSelected ? 'bold' as const : 'normal',
                              fontSize: 16,
                            }}
                          >
                            {day}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                />
                <View className="flex-row items-center justify-center gap-10 mt-[10%]">
                  <AlarmButton title="취소" onPress={handleModalCancel} backgroundColor="#52565A" textColor="#E8ECF0" style={{ width: 120, height: 48 }} />
                  <AlarmButton title="선택" onPress={handleModalSelect} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
                </View>
              </View>
            )}

            {(selectedItem === '시간') && (
              <View>
                <View className="items-center justify-center">
                  <HalfTimeScrollPanel
                    initialTime={{
                      hour: String(time.hour).padStart(2, '0'),
                      minute: String(time.minute).padStart(2, '0'),
                      period: time.period,
                    }}
                    onTimeChange={(hour, minute, period) => {
                      setTime({
                        period: period as '오전' | '오후',
                        hour: parseInt(hour, 10),
                        minute: parseInt(minute, 10),
                      });
                    }}
                  />
                </View>
                <View className="flex-row items-center justify-center gap-10 mt-[10%]">
                  <AlarmButton title="취소" onPress={handleTimeCancel} backgroundColor="#52565A" textColor="#E8ECF0" style={{ width: 120, height: 48 }} />
                  <AlarmButton title="선택" onPress={handleTimeSelect} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
                </View>
              </View>
            )}

            {(selectedItem === '메모') && (
              <View>
                <TextInput
                  className="w-full h-[250px] border-[#65696D] border-[1px] p-4 rounded-[16px] text-white text-xl"
                  placeholder="내용 입력"
                  placeholderTextColor="#979B9F"
                  multiline={true}
                  textAlignVertical="top"
                  value={memo}
                  onChangeText={(text) => setMemo(text)}
                />
                <View className="flex-row items-center justify-center gap-10 mt-[10%]">
                  <AlarmButton title="취소" onPress={handleMemoCancel} backgroundColor="#52565A" textColor="#E8ECF0" style={{ width: 120, height: 48 }} />
                  <AlarmButton title="저장" onPress={handleMemoSave} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
                </View>
              </View>
            )}

          </BottomSheetView>
        </BottomSheetModal>


        <View className="flex-row items-center justify-between mr-[4%]"
          style={{ marginTop: Platform.OS === 'web' ? 10 : 15 }}>
          <View className="flex-row items-center justify-between mr-[4%]" style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
            {isEditingTitle ? (
              <TextInput
                value={title}
                onChangeText={setTitle}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                className="font-pretendard text-white text-[24px] ml-[4%]"
                style={{
                  width: Platform.OS === 'web' ? 380 : 300,
                  borderBottomWidth: 1,
                  borderBottomColor: '#999',
                  paddingBottom: 4,
                }}
                placeholder="알람 제목을 입력하세요"
                placeholderTextColor="#999"
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                <Text
                  className="font-pretendard text-white text-[24px] ml-[4%]"
                  style={{
                    width: Platform.OS === 'web' ? 410 : 300,
                  }}
                >
                  {title || '알람 제목 없음'}
                </Text>
              </TouchableOpacity>
            )}
            <ToggleSwitch isOn={on} onToggle={handleToggleSwitch} disabled={false} />
          </View>
        </View>

        <View className="bg-black items-center justify-center">
          <View className="w-[80%] items-center justify-center"
            style={{ height: Platform.OS === 'web' ? height * 0.28 : height * 0.28 }}>
            <TouchableOpacity onPress={
              () => {
                setSelectedItem("날짜")
                bottomSheetModalRef.current?.present()
              }}>
              <Text className="font-pretendard text-white text-3xl mb-4">
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem("시간");
                  bottomSheetModalRef.current?.present();
                }}
              >
                <Text className="font-pretendard text-white text-[42px]">
                  <Text className="text-[33px]">{time.period}   </Text>
                  {String(time.hour).padStart(2, '0')} : {String(time.minute).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="w-full h-[55%] items-center gap-3 space-y-3">
          <View className="w-[91%] flex-row gap-3">
            <TouchableOpacity className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3"
              activeOpacity={0.8}
              onPress={handleSelectSound}
            >
              <View className="flex-row items-center">
                <IconMusic width={20} height={20} />
                <Text className="font-pretendard text-gray-200 text-xl ml-2">알람음</Text>
              </View>
              <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                <Text className="font-pretendard text-gray-200 text-xl">
                  {alarmToEdit?.sound ?? '선택'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3"
              activeOpacity={0.8}
              onPress={handleSelectVibrate}
            >
              <View className="flex-row items-center">
                <IconBiv width={20} height={20} />
                <Text className="font-pretendard text-gray-200 text-xl ml-2">진동</Text>
              </View>
              <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                <Text className="font-pretendard text-gray-200 text-xl">
                  {alarmToEdit?.vibrate ?? '선택'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="w-[91%] h-[80px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
            activeOpacity={0.8}
            onPress={handleSelectReplay}
          >
            <View className="flex-row items-center">
              <IconRepeat width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">다시 울림</Text>
            </View>
            <Text className="font-pretendard text-gray-200 text-xl mt-2">
              {alarmToEdit?.repeat ?? '선택'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[91%] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
            style={{ height: Platform.OS === 'web' ? height * 0.25 : height * 0.185 }}
            activeOpacity={0.8}
            onPress={
              () => {
                setSelectedItem("메모")
                bottomSheetModalRef.current?.present()
              }}>

            <View className="flex-row items-center">
              <IconMemo width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">메모</Text>
            </View>
            <Text className="font-pretendard text-gray-200 text-xl ml-2">
              {memo.trim() !== '' ? memo : '입력'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center gap-10 -mt-[4%]">
          <AlarmButton title="취소" onPress={handleCancel} backgroundColor="#1C1F21" textColor="#CFD3D7" style={{ width: 120, height: 48 }} />
          <AlarmButton title="저장" onPress={handleSave} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
        </View>

      </BottomLayout>
    </GestureHandlerRootView>
  );
}
