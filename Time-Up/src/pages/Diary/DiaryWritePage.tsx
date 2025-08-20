import BeforeHeader from '@/src/components/common/BeforeHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import DateModal from '../../components/diary/DateModal';
import { usePostDiary } from '../../hooks/useDiaries';
import { RootStackParamList } from '../../types/navigation';

type DiaryWriteRouteProp = RouteProp<RootStackParamList, 'DiaryWritePage'>;

export default function DiaryWritePage() {
    const navigation = useNavigation();
    const route = useRoute<DiaryWriteRouteProp>();
    const { mutate: postMutate } = usePostDiary();

    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const formatDate = (dateToFormat: Date) => {
        return moment(dateToFormat).format('MMMM Do dddd');
    };

    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
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
            onError: (error) => {
                console.error('일기 저장 실패:', error);
                Alert.alert('오류', '일기 저장에 실패했습니다. 다시 시도해주세요.');
            },
        });
    };

    const handleDateSelect = (day: DateData) => {
        const selectedDate = new Date(day.dateString);
        setDate(selectedDate);
        setDatePickerVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-black p-4">
            <BeforeHeader title={formatDate(date)} onBackPress={() => navigation.goBack()} />
            <View className="mb-6">
                <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                    <Text className="text-white text-xl font-semibold">{formatDate(date)}</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-3">
                <TextInput
                    className="text-white text-2xl font-medium leading-7"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor="gray"
                />
            </View>

            <View className="flex-1">
                <TextInput
                    className="text-white text-lg flex-1"
                    value={content}
                    onChangeText={setContent}
                    placeholder="오늘의 이야기를 기록해보세요."
                    placeholderTextColor="gray"
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <View className="flex-row justify-around items-center pt-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="py-3 px-12 rounded-[20px] bg-gray-900"
                >
                    <Text className="text-white text-lg">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} className="py-3 px-12 rounded-[20px] bg-light-button">
                    <Text className="text-black text-lg">저장</Text>
                </TouchableOpacity>
            </View>

            <DateModal
                isVisible={isDatePickerVisible}
                onClose={() => setDatePickerVisible(false)}
                onDaySelect={handleDateSelect}
                currentDate={date}
            />
        </SafeAreaView>
    );
}