import React from 'react';
import { Text, View } from 'react-native';
import CancelButton from './CancleButton';
import ConfirmButton from './ConfirmButton';

interface ModalProps {
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
}

const Modal = ({ onClose, onConfirm, children }: ModalProps) =>{
   const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };
  return (
    <View className="absolute inset-0 bg-black/40 justify-center items-center px-2.5">
      <View
        className="w-full rounded-2xl bg-[#F7F7FE]"
        style={{
          shadowColor: '#65696D',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <View className="px-6 pt-11 pb-9">
          <Text className="text-[20px] leading-[28px] font-medium text-center tracking-[-0.4px]">
            {children}
          </Text>
        </View>

        <View className="flex-row px-[34px] pb-4 gap-4">
          {onConfirm && (
            <View className="flex-1">
              <CancelButton onPress={onClose} />
            </View>
          )}
          <View className="flex-1">
            <ConfirmButton title="확인" onPress = {handleConfirm}/>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Modal;
