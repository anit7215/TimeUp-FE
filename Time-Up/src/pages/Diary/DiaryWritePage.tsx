import BottomLayout from '@/src/Layouts/BottomLayout';
import Modal from '@/src/components/common/Modal';
import DateModal from '@/src/components/diary/DateModal';
import { usePostDiary } from '@/src/hooks/useDiaries';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';

export default function DiaryWritePage() {
    const navigation = useNavigation();
    const { mutate: postMutate } = usePostDiary();

    const [date, setDate] = useState<Date | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const formatDate = (dateToFormat: Date) => {
        return moment(dateToFormat).format('MMMM Do dddd');
    };

    const showAlertModal = (message: string) => {
        setAlertMessage(message);
        setAlertModalVisible(true);
    };

    const handleSave = () => {
        if (!date) {
            showAlertModal('날짜를 선택해주세요.');
            return;
        }
        if (!title.trim() || !content.trim()) {
            showAlertModal('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const payload = {
            title,
            content,
            diary_date: moment(date).format('YYYY-MM-DD'),
        };
        
        postMutate(payload, {
            onSuccess: () => {
                Alert.alert('성공', '일기가 저장되었습니다.');
                navigation.goBack();
            },
            onError: (error: any) => {
                console.error('일기 저장 실패:', error.response.data);
                const message = error.response?.data?.error?.message;
                if (message) {
                    showAlertModal(message);
                } else {
                    showAlertModal('일기 저장에 실패했습니다. 다시 시도해주세요.');
                }
            },
        });
    };

    const handleDateSelect = (day: DateData) => {
        const selectedDate = new Date(day.dateString);
        setDate(selectedDate);
        setDatePickerVisible(false);
    };

    return (
        <BottomLayout>
            <View className="flex-1 px-4 pt-12 pb-6">
                <View className="mb-2">
                    <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                        {date ? (
                            <Text className="text-gray-100 text-xl font-medium leading-7 font-pretendard">
                                {formatDate(date)}
                            </Text>
                        ) : (
                            <Text className="text-gray-500 text-xl font-medium leading-7 font-pretendard">
                                날짜 선택
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mb-4">
                    <TextInput
                        className="text-white text-2xl font-medium leading-loose placeholder-gray-100 font-pretendard"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목 입력"
                    />
                </View>

                <View className="flex-1 mb-6">
                    <TextInput
                        className="p-3 rounded-xl border border-gray-800 bg-gray-900 text-white text-lg flex-1 placeholder-gray-100"
                        value={content}
                        onChangeText={setContent}
                        placeholder="내용 입력"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View className="flex-row justify-around items-center px-8 gap-6 font-pretendard">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-28 py-2 px-[46px] rounded-[20px] bg-gray-700"
                    >
                        <Text className="text-gray-100 text-base text-medium">취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} className="w-28 py-2 px-[46px] rounded-[20px] bg-light-button">
                        <Text className="text-black text-base text-medium">저장</Text>
                    </TouchableOpacity>
                </View>

                <DateModal
                    isVisible={isDatePickerVisible}
                    onClose={() => setDatePickerVisible(false)}
                    onDaySelect={handleDateSelect}
                    currentDate={date ?? new Date()}
                />

                {isAlertModalVisible && (
                    <Modal onClose={() => setAlertModalVisible(false)}>
                        {alertMessage}
                    </Modal>
                )}
            </View>
        </BottomLayout>
    );
}