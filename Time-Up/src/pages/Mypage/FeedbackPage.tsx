import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import Modal from '../../components/common/Modal';

export default function FeedbackPage() {
  const [opinion, setOpinion] = useState('');
  const [alarmTimeScore, setAlarmTimeScore] = useState<number | null>(null);
  const [wakeUpScore, setWakeUpScore] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <ScrollView className="flex-1 bg-black px-4 py-4">
        <BeforeHeader title="자동 알람 피드백" rightLabel="제출" onRightPress={() => setOpenModal(true)} />
        <View className="bg-gray-900 rounded-2xl p-4 mb-4">
          <Text className="text-white mb-2 font-normal text-[18px] leading-[24px] tracking-normal">오늘 기상 알람 시간은 어땠나요?</Text>
          <View className="flex-row items-center justify-between mb-1 px-4">
            <Text className="text-white text-sm">너무 늦어요</Text>
            <Text className="text-white text-sm">너무 빨라요</Text>
          </View>
          <View className="flex-row px-[22px] justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setAlarmTimeScore(i)}>
                <View
                  className={`w-9 h-9 rounded-full ${
                    alarmTimeScore === i ? 'bg-blue' : 'bg-gray-300'
                  }`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-gray-900 rounded-2xl p-4 mb-2">
          <Text className="text-white mb-2 font-normal text-[18px] leading-[24px] tracking-normal">알람이 울렸을 때 일어나기 쉬우셨나요?</Text>
          <View className="flex-row items-center justify-between mb-1 px-4">
            <Text className="text-white text-sm">너무 힘들었어요</Text>
            <Text className="text-white text-sm">너무 쉬웠어요</Text>
          </View>
          <View className="flex-row justify-between px-[22px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setWakeUpScore(i)}>
                <View
                  className={`w-9 h-9 rounded-full ${
                    wakeUpScore === i ? 'bg-blue' : 'bg-gray-300'
                  }`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-gray-900 rounded-2xl px-2 py-3">
          <Text className="text-white mb-2 font-normal text-[18px] leading-[24px] tracking-normal">자유롭게 의견을 남겨주세요!</Text>
          <TextInput
            multiline
            className="bg-gray-800 rounded-xl text-white p-3 text-base h-60"
            placeholder="내용 입력"
            placeholderTextColor="#999"
            value={opinion}
            onChangeText={setOpinion}
          />
        </View>
      </ScrollView>
      {openModal && (  <Modal
          onClose={() => setOpenModal(false)}
          onConfirm={() => {
            setOpenModal(false);
            console.log('제출 내용:', { alarmTimeScore, wakeUpScore, opinion });
          }}
        >
          피드백을 제출하시겠습니까?
        </Modal>
      )}
    </>
  );
}
