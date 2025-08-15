import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import HalfTimeScrollPanel from '../common/HalfTimeScrollPanel';

interface WakeUpTimeModalProps {
  onClose?: () => void;
  onSelect: (hour: string, minute: string, period: string, selectedDays: string[]) => void;
  initialSelectedDays: string[];
  initialTime?: SelectedTime;
}
export interface WakeUpTimeModalRef {
  present: () => void;
  dismiss: () => void;
}
type SelectedTime = {
  hour: string;
  minute: string;
  period: string;
};

const days = ['일', '월', '화', '수', '목', '금', '토'];

const WakeUpTimeModal = forwardRef<WakeUpTimeModalRef, WakeUpTimeModalProps>(
  ({ onClose, onSelect, initialSelectedDays, initialTime }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['65%'], []);
    const [selectedTime, setSelectedTime] = useState<SelectedTime>(
      initialTime || { hour: '07', minute: '00', period: '오전' });
    const [selectedDays, setSelectedDays] = useState<string[]>(initialSelectedDays);
    useEffect(() => {
      setSelectedDays(initialSelectedDays);
    }, [initialSelectedDays]);
    useImperativeHandle(ref, () => ({
      present: () => {
        setSelectedTime(initialTime || { hour: '07', minute: '00', period: '오전' });
        setSelectedDays(initialSelectedDays); 
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const toggleDay = (day: string) => {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    };

    const handleTimeChange = (hour: string, minute: string, period: string) => {
      setSelectedTime({ hour, minute, period: period as '오전' | '오후' });
    };

    const handleSelect = () => {
      onSelect(selectedTime.hour, selectedTime.minute, selectedTime.period, selectedDays);
      bottomSheetModalRef.current?.dismiss();
    };

    const handleClose = () => {
      bottomSheetModalRef.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onClose}
        backgroundStyle={{ backgroundColor: '#33373B' }}
        handleIndicatorStyle={{ backgroundColor: '#52565A' }}
      >
        <BottomSheetView className='px-12 py-8 flex-1 justify-between items-center'>
          <View className="w-full items-center flex-grow justify-between">
            <View  className='items-center'>
              <HalfTimeScrollPanel 
                onTimeChange={handleTimeChange}/>
              <View className="flex-row justify-between w-full px-9 mt-8">
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    className={`px-3 py-1 rounded-full ${
                      selectedDays.includes(day) ? 'bg-blue' : 'bg-transparent'
                    }`}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      className={`text-lg text-white font-normal`}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row justify-between items-center w-full px-12 mt-8 mb-12 gap-6">
              <TouchableOpacity 
                onPress={handleClose}
                className='flex-1 px-[46px] py-2 rounded-[20px] justify-center items-center bg-gray-700'
              >
                <Text className="text-gray-100 text-base font-medium leading-normal">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSelect}
                disabled={selectedDays.length === 0}
                className={`flex-1 px-[46px] py-2  rounded-[20px] justify-center items-center bg-light ${
                  selectedDays.length === 0 ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-black text-base font-medium leading-normal">선택</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);
WakeUpTimeModal.displayName = 'WakeUpTimeModal';
export default WakeUpTimeModal;