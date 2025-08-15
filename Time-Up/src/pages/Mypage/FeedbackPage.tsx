import { getAlarmList, postAutoAlarmFeedback } from '@/src/apis/users';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BeforeHeader from '../../components/common/BeforeHeader';
import Modal from '../../components/common/Modal';

export default function FeedbackPage() {
  const navigation = useAppNavigation();
  const [opinion, setOpinion] = useState('');
  const [alarmTimeScore, setAlarmTimeScore] = useState<number | null>(null);
  const [wakeUpScore, setWakeUpScore] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [alarmId, setAlarmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodayAlarmId = async () => {
      try {
        const alarmList = await getAlarmList();
        const today = new Date().toISOString().slice(0, 10);

        if (alarmList?.auto_alarms?.length > 0) {
          const todayAlarm = alarmList.auto_alarms.find((alarm: any) => {
            const alarmDate = alarm.alarm_time?.slice(0, 10);
            return alarmDate === today;
          });

          if (todayAlarm) {
            setAlarmId(todayAlarm.auto_alarm_id);
          } else {
            console.warn('오늘 울린 알람이 없습니다.');
          }
        } else {
          console.warn('자동 알람이 없습니다.');
        }
      } catch (error) {
        console.error('알람 데이터 불러오기 실패:', error);
      }
    };

    fetchTodayAlarmId();
  }, []);

  const submitFeedback = async () => {
    if (alarmTimeScore == null || wakeUpScore == null) {
      alert('모든 항목을 선택해주세요.');
      return;
    }
    if (!alarmId) {
      alert('제출할 알람이 없습니다.');
      return;
    }

    try {
      await postAutoAlarmFeedback({
        time_rating: alarmTimeScore,
        wakeup_rating: wakeUpScore,
        comment: opinion,
        alarm_id: alarmId,
      });
      alert('피드백이 제출되었습니다.');
      navigation.navigate('MyPage');
    } catch (error) {
      console.error(error);
      alert('제출 실패! 다시 시도해주세요.');
    }
  };

  return (
    <>
      <ScrollView className="flex-1 bg-black px-4 py-4">
        <BeforeHeader title="자동 알람 피드백" rightLabel="제출" onRightPress={() => setOpenModal(true)} onBackPress={() => navigation.navigate('MyPage')}
 />
        <View className="bg-gray-900 rounded-2xl p-4 mb-4">
          <View className="self-stretch pb-1 border-b border-neutral-700 inline-flex justify-center items-center gap-2.5">
            <Text className="text-white mb-1 font-normal text-lg leading-normal">오늘 기상 알람 시간은 어땠나요?</Text>
          </View>
          <View className="flex-row items-center justify-between mb-1 px-3 py-2">
            <Text className="text-white text-xs font-normal tracking-tight">너무 늦어요</Text>
            <Text className="text-white text-xs font-normal tracking-tight">너무 빨라요</Text>
          </View>
          <View className="flex-row px-[20px] justify-between">
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
          <View className="self-stretch pb-1 border-b border-neutral-700 inline-flex justify-center items-center gap-2.5">
            <Text className="text-white mb-1 font-normal text-lg leading-normal">알림이 울렸을 때 일어나기 쉬우셨나요?</Text>
          </View>
          <View className="flex-row items-center justify-between mb-1 px-3 py-2">
            <Text className="text-white text-xs font-normal tracking-tight">너무 힘들었어요</Text>
            <Text className="text-white text-xs font-normal tracking-tight">너무 쉬웠어요</Text>
          </View>
          <View className="flex-row justify-between px-[20px]">
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
          <View className="self-stretch pb-1 border-b border-neutral-700 inline-flex justify-center items-center gap-2.5">
            <Text className="text-white mb-1 font-normal text-lg leading-normal">자유롭게 의견을 남겨주세요!</Text>
          </View>
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
            submitFeedback();
          }}
        >
          피드백을 제출하시겠습니까?
        </Modal>
      )}
    </>
  );
}
