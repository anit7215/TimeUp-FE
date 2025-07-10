// src/pages/OnboardingPage.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';
import IconImage from '../../assets/images/Icon.svg';
import Modal from '../components/common/Modal';


export default function OnboardingPage() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <Image source={IconImage} className="w-24 h-24 mt-4" />
      <TouchableOpacity
        onPress={() => navigation.navigate('LoginPage')}
        className="w-[120px] h-[36px] bg-[#33373B] rounded-[8px] px-4 py-2 shadow-md mb-4"
        style={{
          shadowColor: '#4D4DFF',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Text className="text-white text-center">구글로 로그인</Text>
      </TouchableOpacity>

      <Button title="모달 열기" onPress={() => setOpen(true)} />
      {open && (
        <Modal onClose={() => setOpen(false)}>
            {"지금까지 입력하신 내용을 \n제출하시겠습니까?"}
        </Modal>
      )}
    </View>
  );
}