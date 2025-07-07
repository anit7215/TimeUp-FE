import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Modal from '../components/common/Modal';


export default function OnBoardingPage() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl text-blue-600 font-bold">온보딩</Text>
      <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded"
        onPress={() => navigation.navigate('LoginPage')}>
        <Text className="text-white">로그인</Text>
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
