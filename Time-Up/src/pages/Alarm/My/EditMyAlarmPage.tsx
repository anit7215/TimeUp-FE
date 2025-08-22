// src/pages/EditMyAlarmPage.tsx
import { putMyAlarm } from '@/src/apis/alarmApi';
import AlarmButton from '@/src/components/alarm/AlarmButton';
import HalfTimeScrollPanel from '@/src/components/common/HalfTimeScrollPanel';
import ToggleSwitch from '@/src/components/common/ToggleSwitch';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import BottomLayout from '@/src/Layouts/BottomLayout';
import type { AlarmItem } from '@/src/types/alarm';
import { formatDate } from '@/src/utils/AlarmFormat';
import { toPutMyAlarmRequest } from '@/src/utils/alarmTransform';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

import IconBiv from '../../../../assets/images/AlarmBiv.svg';
import IconMemo from '../../../../assets/images/AlarmMemo.svg';
import IconMusic from '../../../../assets/images/AlarmMusic.svg';
import IconRepeat from '../../../../assets/images/AlarmRepeat.svg';

export default function EditMyAlarmPage() {
  const navigation = useAppNavigation();
  const { height } = Dimensions.get('window');
  const { selectedAlarmId, myAlarms, selectedAlarmDate, setSelectedAlarmDate,
     updateAlarmField, toggleMyAlarmActivation } = useAlarmContext();
  const [currentDate, setCurrentDate] = useState(selectedAlarmDate);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%'], [])
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  const alarmToEdit = myAlarms.find(a => a.id === selectedAlarmId);

  const [title, setTitle] = useState(alarmToEdit?.title ?? '');
  const [time, setTime] = useState<AlarmItem['time']>(
    alarmToEdit?.time ?? { period: '오전', hour: 7, minute: 0 }
  );
  const [date, setDate] = useState<AlarmItem['date']>(
    alarmToEdit?.date ?? { fullDate: '2025-06-30', dayOfWeek: '월' }
  );
  const [memo, setMemo] = useState(alarmToEdit?.memo ?? '');
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [isActive, setIsActive] = useState(alarmToEdit?.isActive ?? true);

  const [SoundOn, SoundSetOn] = useState(alarmToEdit?.isSound ?? false);
  const [VibrateOn, VibrateSetOn] = useState(alarmToEdit?.isVibrating ?? false);
  const [RepeatOn, RepeatSetOn] = useState(alarmToEdit?.isRepeating ?? false);

  const handleCancel = () => {
    console.log(`${title} 알람 편집을 취소합니다`);
    navigation.goBack();
  };

  const handleSave = async () => {
    if (selectedAlarmId) {
      console.log('내 알람을 저장합니다.');
      const alarmToEdit = myAlarms.find((a) => a.id === selectedAlarmId);
      if (!alarmToEdit) return;

      updateAlarmField(selectedAlarmId, 'title', title);
      updateAlarmField(selectedAlarmId, 'time', time);
      updateAlarmField(selectedAlarmId, 'date', date);
      updateAlarmField(selectedAlarmId, 'memo', memo);
      updateAlarmField(selectedAlarmId, 'isActive', isActive);

      try {
        const patchBody = toPutMyAlarmRequest({
          ...alarmToEdit,
          title,
          time,
          date,
          memo,
          isActive,
          isSound: alarmToEdit.isSound,
          isVibrating: alarmToEdit.isVibrating,
          isRepeating: alarmToEdit.isRepeating,
        });
        console.log('PATCH 요청 바디:', JSON.stringify(patchBody, null, 2));
        if (!selectedAlarmId) throw new Error('서버 응답에 alarm_id가 없습니다.');
        console.log('수정 요청할 alarm_id:', selectedAlarmId);
        const res = await putMyAlarm(selectedAlarmId, patchBody);
        console.log('알람 수정 성공:', res);
        navigation.navigate('MyAlarmPage');
      } catch (error: any) {
        const status = error?.response?.status;
        const apiErr = error?.response?.data?.error;
        const apiMsg = error?.response?.data?.message;

        if ((status === 422 || status === 400) &&
        (apiErr === 'BusinessLogicError')) {
          Alert.alert('저장 실패', '과거 시간에는 알람을 설정할 수 없습니다.');
          return;
        }
        else Alert.alert('저장 실패', '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        console.error('알람 수정 실패:', error);
      }
    }
  }

  const handleToggleSwitch = useCallback(async () => {
    if (!selectedAlarmId) return;

    try {
      await toggleMyAlarmActivation(selectedAlarmId);
      const newState = !isActive;
      setIsActive(newState);
      updateAlarmField(selectedAlarmId, 'isActive', newState);
      console.log(`알람 ${selectedAlarmId}번이 ${newState ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      console.error(`알람 ${selectedAlarmId} 상태 토글 실패:`, error);
    }
  }, [selectedAlarmId, isActive]);

  const handleSelectSound = () => {
    navigation.navigate('SelectMyAlarmSoundPage');
  };

  const handleSoundToggleSwitch = useCallback(() => {
    const newState = !SoundOn;
    SoundSetOn(newState);
    if (selectedAlarmId != null) {
      updateAlarmField(selectedAlarmId, 'isSound', newState);
    }
  }, [SoundOn, selectedAlarmId]);

  const handleVibrateToggleSwitch = useCallback(() => {
    const newState = !VibrateOn;
    VibrateSetOn(newState);
    if (selectedAlarmId != null) {
      updateAlarmField(selectedAlarmId, 'isVibrating', newState);
    }
  }, [VibrateOn, selectedAlarmId]);

  const handleRepeatToggleSwitch = useCallback(() => {
    const newState = !RepeatOn;
    RepeatSetOn(newState);
    if (selectedAlarmId != null) {
      updateAlarmField(selectedAlarmId, 'isRepeating', newState);
    }
  }, [RepeatOn, selectedAlarmId]);

  const handleSelectVibrate = () => {
    navigation.navigate('SelectMyAlarmVibratePage');
  };

  const handleSelectReplay = () => {
    navigation.navigate('SelectMyAlarmReplayPage');
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
        <ScrollView>
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
            <ToggleSwitch isOn={alarmToEdit?.isActive ?? false} onToggle={handleToggleSwitch} disabled={false} />
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

            <View className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3 pr-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <IconMusic width={20} height={20} />
                  <Text className="font-pretendard text-gray-200 text-xl ml-2">알람음</Text>
                </View>
                <ToggleSwitch isOn={SoundOn} onToggle={handleSoundToggleSwitch} disabled={false} />
              </View>
              <TouchableOpacity
                className="flex-1 items-center justify-center"
                activeOpacity={0.8}
                onPress={handleSelectSound}
              >
                <Text className="font-pretendard text-gray-200 font-semibold text-xl -mt-3">
                  {alarmToEdit?.sound ?? '선택'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-[48%] h-[130px] bg-dark border border-dark-stroke rounded-3xl pt-2 pl-3 pr-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <IconBiv width={20} height={20} />
                  <Text className="font-pretendard text-gray-200 text-xl ml-2">진동</Text>
                </View>
                <ToggleSwitch isOn={VibrateOn} onToggle={handleVibrateToggleSwitch} disabled={false} />
              </View>
              <TouchableOpacity
                className="flex-1 items-center justify-center"
                activeOpacity={0.8}
                onPress={handleSelectVibrate}
              >
                <Text className="font-pretendard text-gray-200 font-semibold text-xl -mt-3">
                  {alarmToEdit?.vibrate ?? '선택'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-[91%] h-[80px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3 pr-3">
            <View className="flex-row items-center justify-between w-full">
              <View className="flex-row items-center">
                <IconRepeat width={20} height={20} />
                <Text className="font-pretendard text-gray-200 text-xl ml-2">다시 울림</Text>
              </View>
              <ToggleSwitch isOn={RepeatOn} onToggle={handleRepeatToggleSwitch} disabled={false} />
            </View>
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              activeOpacity={0.8}
              onPress={handleSelectReplay}
            >
              <Text className="font-pretendard text-gray-200 font-semibold text-xl">
                {alarmToEdit?.repeat ?? '선택'}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className="w-[91%] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3"
            style={{ height: Platform.OS === 'web' ? height * 0.25 : height * 0.185 }}
          >
            <View className="flex-row items-center">
              <IconMemo width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">메모</Text>
            </View>

            {isEditingMemo ? (
              <TextInput
                className="w-full h-[150px] text-white text-xl mt-2 pr-4"
                multiline
                autoFocus
                textAlignVertical="top"
                placeholder="내용 입력"
                placeholderTextColor="#979B9F"
                value={memo}
                onChangeText={setMemo}
                onBlur={() => setIsEditingMemo(false)}
                returnKeyType="done"
                onSubmitEditing={() => setIsEditingMemo(false)}
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingMemo(true)} className="w-full">
                <Text className="font-pretendard text-gray-200 text-xl ml-2 mt-2">
                  {memo.trim() !== '' ? memo : '입력'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-10 -mt-[1%]">
          <AlarmButton title="취소" onPress={handleCancel} backgroundColor="#1C1F21" textColor="#CFD3D7" style={{ width: 120, height: 48 }} />
          <AlarmButton title="저장" onPress={handleSave} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
        </View>
        </ScrollView>
      </BottomLayout>
    </GestureHandlerRootView>
  );
}
