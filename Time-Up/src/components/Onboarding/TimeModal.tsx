import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import TimeScrollPanel from '../common/TimeScrollPanel';

interface TimeModalProps {
  onClose?: () => void;
  onSelect: (hour: string, minute: string) => void;
  choice?: 'optional' | 'required';
  initialTime?: { hour: string; minute: string };
}

export interface TimeModalRef {
  present: () => void;
  dismiss: () => void;
}

const TimeModal = forwardRef<TimeModalRef, TimeModalProps>(
  ({ onClose, onSelect, choice, initialTime }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['65%'], []);
    const [selectedTime, setSelectedTime] = useState(
      initialTime || { hour: '00', minute: '00' }
    );
    useImperativeHandle(ref, () => ({
      present: () => {
        setSelectedTime(initialTime || { hour: '00', minute: '00' });
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const handleTimeChange = useCallback((hour: string, minute: string) => {
      setSelectedTime({ hour, minute });
    }, []);

    const handleSelect = () => {
      onSelect(selectedTime.hour, selectedTime.minute);
      bottomSheetModalRef.current?.dismiss();
    };

    const handleClose = () => {
      bottomSheetModalRef.current?.dismiss();
    };

    const handleSelectLater = () => {
      onSelect('00','00');
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
        <BottomSheetView className='px-4 py-7 flex-1 justify-between'>
          <View>
            <View className="w-full items-end" style={{ height: 20, marginBottom: 40 }}>
              {choice === 'optional' && (
                <TouchableOpacity className="pr-4" onPress={handleSelectLater}>
                  <Text className="text-gray-300 underline text-sm font-normal leading-tight">
                    나중에 입력할게요.
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="items-center">
              <TimeScrollPanel
                onTimeChange={handleTimeChange}
                // initialTime={selectedTime}
              />
            </View>
          </View>
          <View className="flex-row w-full px-6 mt-16 mb-7">
            <TouchableOpacity
              onPress={handleClose}
              className='flex-1 py-3 rounded-[20px] justify-center items-center bg-gray-700 mr-6'
            >
              <Text className="text-gray-100 text-base font-medium leading-normal">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSelect}
              className='flex-1 py-3 rounded-[20px] justify-center items-center bg-light'
            >
              <Text className="text-black text-base font-medium leading-normal">선택</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );});
export default TimeModal;