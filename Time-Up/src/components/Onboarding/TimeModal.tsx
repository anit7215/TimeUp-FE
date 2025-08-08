import React, { useCallback, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import TimeScrollPanel from '../common/TimeScrollPanel';

interface TimeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (hour: string, minute: string) => void;
  choice?: 'optional' | 'required';
}

export default function TimeModal({ visible, onClose, onSelect, choice }: TimeModalProps) {
  const [selectedTime, setSelectedTime] = useState({ hour: '00', minute: '00' });

  const handleTimeChange = useCallback((hour: string, minute: string) => {
    setSelectedTime({ hour, minute });
  }, []);

  const handleSelect = () => {
    onSelect(selectedTime.hour, selectedTime.minute);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable 
          className='px-4 pt-9 pb-12 rounded-t-[32px] flex-col justify-end items-center bg-gray-800'
          onPress={() => {}}
        >
          {choice === 'optional'&& (
            <TouchableOpacity className="w-full items-end" onPress={() => {
              onSelect('00','00'); 
              onClose();
            }}>
              <Text className="text-gray-300 underline text-sm font-normal leading-tight">
                나중에 입력할게요.
              </Text>
            </TouchableOpacity>
          )}
          
          <TimeScrollPanel onTimeChange={handleTimeChange} />
          
          <View className="flex-row justify-between gap-6 items-center w-full px-6 mt-16">
            <TouchableOpacity 
              onPress={onClose} 
              className='px-[46px] py-2 rounded-[20px] justify-center items-center bg-gray-700'
            >
              <Text className="text-gray-100 text-base font-medium leading-normal">취소</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSelect}
              className='px-[46px] py-2 rounded-[20px] justify-center items-center bg-light'
            >
              <Text className="text-black text-base font-medium leading-normal">선택</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}