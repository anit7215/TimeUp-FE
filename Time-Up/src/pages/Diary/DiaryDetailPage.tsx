import BeforeHeader from '@/src/components/common/BeforeHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import DeleteModal from '../../components/common/Modal';
import DateModal from '../../components/diary/DateModal';
import { useDeleteDiary, useUpdateDiary } from '../../hooks/useDiaries';
import { RootStackParamList } from '../../types/navigation';

type DiaryDetailRouteProp = RouteProp<RootStackParamList, 'DiaryDetailPage'>;

export default function DiaryDetailPage() {
    const navigation = useNavigation();
    const route = useRoute<DiaryDetailRouteProp>();
    const existingDiary = route.params?.diary;

    const { mutate: updateMutate } = useUpdateDiary();
    const { mutate: deleteMutate } = useDeleteDiary();

    const [isEditable, setIsEditable] = useState(!existingDiary);
    const [date, setDate] = useState(
        existingDiary ? new Date(existingDiary.diary_date) : new Date()
    );
    const [title, setTitle] = useState(existingDiary?.title || '');
    const [content, setContent] = useState(existingDiary?.content || '');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const formatDate = (dateToFormat: Date) => {
        return moment(dateToFormat).format('MMMM Do dddd');
    };

    const handleSave = () => {
        if (!existingDiary) return;
        if (!title.trim() || !content.trim()) {
            Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
            return;
        }

        const payload = { title, content, diary_date: moment(date).format('YYYY-MM-DD') };
        
        updateMutate({ diary_id: existingDiary.diary_id, payload }, {
            onSuccess: () => {
                Alert.alert('성공', '일기가 수정되었습니다.');
                navigation.goBack();
            },
            onError: (error) => {
                console.error('일기 수정 실패:', error);
                Alert.alert('오류', '요청에 실패했습니다. 다시 시도해주세요.');
            },
        });
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (!existingDiary) return;
        deleteMutate(existingDiary.diary_id, {
            onSuccess: () => {
                Alert.alert('성공', '일기가 삭제되었습니다.');
                navigation.goBack();
            },
            onError: (error) => {
                console.error('일기 삭제 실패:', error);
                Alert.alert('오류', '삭제에 실패했습니다.');
            },
        });
    };

    const handleCancelEdit = () => {
        if (!existingDiary) return;
        setTitle(existingDiary.title);
        setContent(existingDiary.content);
        setDate(new Date(existingDiary.diary_date));
        setIsEditable(false);
    };

    const handleDateSelect = (day: DateData) => {
        const localDate = new Date(day.dateString);
        setDate(localDate);
        setDatePickerVisible(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-black p-4 font-pretendard">
            <BeforeHeader title={formatDate(date)} onBackPress={() => navigation.goBack()} />
            <View className="mb-6">
                <TouchableOpacity onPress={() => setDatePickerVisible(true)} disabled={!isEditable}>
                    <Text className="text-white text-xl font-semibold">{formatDate(date)}</Text>
                </TouchableOpacity>
            </View>
            <View className="mb-3">
                <TextInput
                    className="text-white text-2xl font-medium leading-7"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="제목"
                    placeholderTextColor="gray"
                    editable={isEditable}
                />
            </View>
            <View className="flex-1">
                <TextInput
                    className="text-white text-lg flex-1"
                    value={content}
                    onChangeText={setContent}
                    placeholder="오늘의 이야기"
                    placeholderTextColor="gray"
                    multiline
                    textAlignVertical="top"
                    editable={isEditable}
                />
            </View>
            <View className="flex-row justify-around items-center pt-4">
                {isEditable ? (
                    <>
                        <TouchableOpacity
                            onPress={handleCancelEdit}
                            className="py-3 px-12 rounded-[20px] bg-gray-900"
                        >
                            <Text className="text-white text-lg">취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} className="py-3 px-12 rounded-[20px] bg-light-button">
                            <Text className="text-black text-lg">저장</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={handleDelete} className="py-3 px-12 rounded-[20px] bg-gray-900">
                            <Text className="text-white text-lg">삭제</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsEditable(true)} className="py-3 px-12 rounded-[20px] bg-light-button">
                            <Text className="text-black text-lg">편집</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <DateModal
                isVisible={isDatePickerVisible}
                onClose={() => setDatePickerVisible(false)}
                onDaySelect={handleDateSelect}
                currentDate={date}
            />

            {isDeleteModalVisible && (
                <DeleteModal
                    onClose={() => setDeleteModalVisible(false)}
                    onConfirm={handleConfirmDelete}
                >
                    정말로 이 일기를 삭제하시겠습니까?
                </DeleteModal>
            )}
        </SafeAreaView>
    );
}