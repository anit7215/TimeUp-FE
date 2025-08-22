// src/pages/EditWakeUpAlarmPage.tsx
import { putWakeupAlarm } from '@/src/apis/alarmApi';
import AlarmButton from '@/src/components/alarm/AlarmButton';
import HalfTimeScrollPanel from '@/src/components/common/HalfTimeScrollPanel';
import { AlarmItem } from '@/src/types/alarm';
import { toPutWakeupAlarmRequest } from '@/src/utils/alarmTransform';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToggleSwitch from '../../../components/common/ToggleSwitch';
import { Day, useAlarmContext } from '../../../contexts/AlarmContext';
import useAppNavigation from '../../../hooks/useAppNavigation';
import BottomLayout from '../../../Layouts/BottomLayout';

import IconBiv from '../../../../assets/images/AlarmBiv.svg';
import IconCalendar from '../../../../assets/images/AlarmCalendar.svg';
import IconMemo from '../../../../assets/images/AlarmMemo.svg';
import IconMusic from '../../../../assets/images/AlarmMusic.svg';
import IconRepeat from '../../../../assets/images/AlarmRepeat.svg';


export default function EditWakeUpAlarmPage() {
  const navigation = useAppNavigation();
  const weekdays: Day[] = ['월', '화', '수', '목', '금', '토', '일'];
  const { height } = Dimensions.get('window');
  const { selectedAlarmId, wakeupAlarms, selectedDay, weekdaySwitchStates, setWeekdaySwitchStates,
    updateWakeupAlarmField } = useAlarmContext();
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%'], [])
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index)
  }, [])

  // 제목, 시간, 날짜, 사운드, 진동, 반복, 메모, 알람 온오프 상태 관리
  const alarmToEdit = wakeupAlarms.find(a => a.serverId === selectedAlarmId);
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

  const handleToggleSwitchForDay = (day: Day) => {
    setWeekdaySwitchStates((prev) => {
      const nextState = !prev[day];
      console.log(`${day} 기상 알람이 ${nextState ? '켜졌습니다' : '꺼졌습니다'}.`);
      return {
        ...prev,
        [day]: nextState,
      };
    });
  };

  const handleCancel = () => {
    console.log(`${title} 알람 편집을 취소합니다`);
    navigation.goBack();
  };

  const handleSave = async () => {
    console.log('기상 알람을 저장합니다.');
    if (!selectedAlarmId) return;

    const alarmToEdit = wakeupAlarms.find(a => a.serverId === selectedAlarmId);
    if (!alarmToEdit) return;

    try {
      updateWakeupAlarmField(selectedAlarmId, 'title', title);
      updateWakeupAlarmField(selectedAlarmId, 'time', time);
      updateWakeupAlarmField(selectedAlarmId, 'date', date);
      updateWakeupAlarmField(selectedAlarmId, 'memo', memo);
      updateWakeupAlarmField(selectedAlarmId, 'isActive', isActive);

      // API 바디 변환
      const requestBody = toPutWakeupAlarmRequest({
        ...alarmToEdit,
        title,
        time,
        memo,
        isActive,
      });

      if (alarmToEdit?.serverId == null) {
        console.error('서버 ID가 없습니다. (wakeup_alarm_id 누락)');
        return;
      }
      const remoteId = alarmToEdit.serverId; // 여기서부터 number로 추론됨
      console.log('보낼 wakeup 알람 데이터:', requestBody, '서버ID:', remoteId);
      const response = await putWakeupAlarm(remoteId, requestBody);

      console.log('기상 알람 수정 성공:', response);
      // (아래 선택) 성공 후 서버와 재동기화
      // await refreshAlarms();
    } catch (error: any) {
      console.log('서버 응답:', error?.response?.data);
      console.error('기상 알람 수정 실패:', error);
    }

    navigation.navigate('WakeUpAlarmPage');
  };

  const handleSelectSound = () => {
    navigation.navigate('SelectWakeupAlarmSoundPage');
  };

  const handleSelectVibrate = () => {
    navigation.navigate('SelectWakeupAlarmVibratePage');
  };

  const handleSelectReplay = () => {
    navigation.navigate('SelectWakeupAlarmReplayPage');
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

  const handleSoundToggleSwitch = useCallback(() => {
    const newState = !SoundOn;
    SoundSetOn(newState);
    if (selectedAlarmId != null) {
      updateWakeupAlarmField(selectedAlarmId, 'isSound', newState);
    }
  }, [SoundOn, selectedAlarmId]);

  const handleVibrateToggleSwitch = useCallback(() => {
    const newState = !VibrateOn;
    VibrateSetOn(newState);
    if (selectedAlarmId != null) {
      updateWakeupAlarmField(selectedAlarmId, 'isVibrating', newState);
    }
  }, [VibrateOn, selectedAlarmId]);

  const handleRepeatToggleSwitch = useCallback(() => {
    const newState = !RepeatOn;
    RepeatSetOn(newState);
    if (selectedAlarmId != null) {
      updateWakeupAlarmField(selectedAlarmId, 'isRepeating', newState);
    }
  }, [RepeatOn, selectedAlarmId]);

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
          style={{ marginTop: Platform.OS === 'web' ? 30 : 15 }}>
          <Text className='font-pretendard text-white text-[24px]'
            style={{ marginLeft: Platform.OS === 'web' ? 20 : 0 }}>
            {selectedDay}요일 기상 알람
          </Text>
          <ToggleSwitch
            isOn={selectedDay ? weekdaySwitchStates[selectedDay] : false}
            onToggle={() => {
              if (selectedDay) handleToggleSwitchForDay(selectedDay);
            }}
            disabled={!selectedDay}
          />
        </View>

        <View className="bg-black items-center justify-center">
          <View className="w-[80%] items-center justify-center"
            style={{ height: Platform.OS === 'web' ? height * 0.28 : height * 0.28 }}>
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
          <View className="w-[91%] h-[80px] bg-dark border border-dark-stroke rounded-3xl items-start justify-start pt-2 pl-3">
            <View className="flex-row items-center">
              <IconCalendar width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">반복요일</Text>
            </View>

            <View className="flex-row items-center justify-center gap-x-4 mt-[2%] mx-4"
              style={{ marginLeft: Platform.OS === 'web' ? 40 : 0 }}>
              {weekdays.map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <View
                    key={day}
                    className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-[#CCCCFF]' : ''
                      }`}
                  >
                    <Text
                      className={`text-xl ${isSelected ? 'text-black font-semibold' : 'text-white'
                        }`}
                    >
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

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
            style={{ height: Platform.OS === 'web' ? height * 0.11 : height * 0.09 }}
          >
            <View className="flex-row items-center">
              <IconMemo width={20} height={20} />
              <Text className="font-pretendard text-gray-200 text-xl ml-2">메모</Text>
            </View>

            {isEditingMemo ? (
              <TextInput
                className="w-full h-[50px] text-white text-xl mt-2 pr-4"
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

        </ScrollView>

        <View className="flex-row items-center justify-center gap-10 -mt-[4%]">
          <AlarmButton title="취소" onPress={handleCancel} backgroundColor="#1C1F21" textColor="#CFD3D7" style={{ width: 120, height: 48 }} />
          <AlarmButton title="저장" onPress={handleSave} backgroundColor="#CCCCFF" textColor="black" style={{ width: 120, height: 48 }} />
        </View>
      </BottomLayout>
    </GestureHandlerRootView>
  );
}
