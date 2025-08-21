import Modal from '@/src/components/common/Modal';
import DateModal from '@/src/components/diary/DateModal';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import { useGetDiaryList } from '@/src/hooks/useDiaries';
import moment from 'moment';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, LayoutChangeEvent, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import PlusIcon from '../../../assets/images/PlusIcon.svg';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
import DiaryCard, { ADD_DIARY_CARD_ID } from '../../components/diary/DiaryCard';
import BottomLayout from '../../Layouts/BottomLayout';

export default function DiaryPage() {
    const navigation = useAppNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [containerWidth, setContainerWidth] = useState(0);

    const { data: diaries = [], isLoading } = useGetDiaryList();

    const { ITEM_WIDTH, ITEM_GAP, ITEM_FULL_SIZE, PAGE_HORIZONTAL_PADDING } = useMemo(() => {
        if (containerWidth === 0) {
            return { ITEM_WIDTH: 0, ITEM_GAP: 0, ITEM_FULL_SIZE: 0, PAGE_HORIZONTAL_PADDING: 0 };
        }
        const PADDING = 68;
        const GAP = 12;
        const ITEM_W = containerWidth - PADDING * 2;
        return {
            ITEM_WIDTH: ITEM_W,
            ITEM_GAP: GAP,
            ITEM_FULL_SIZE: ITEM_W + GAP,
            PAGE_HORIZONTAL_PADDING: PADDING,
        };
    }, [containerWidth]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    const processedDiaries = useMemo(() => {
        if (diaries.length === 0) {
            return [{ diary_id: ADD_DIARY_CARD_ID, title: '', content: '', diary_date: moment().format('YYYY-MM-DD') }];
        }
        const todayString = moment().format('YYYY-MM-DD');
        const hasTodayDiary = diaries.some((diary) => moment(diary.diary_date).format('YYYY-MM-DD') === todayString);
        if (hasTodayDiary) return diaries;
        return [{ diary_id: ADD_DIARY_CARD_ID, title: '', content: '', diary_date: moment().format('YYYY-MM-DD') }, ...diaries];
    }, [diaries]);

    const handlePressAdd = () => navigation.navigate('DiaryWritePage');

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertModalVisible(true);
    };

    const handleSearchDateSelect = (day: DateData) => {
        setSearchModalVisible(false);
        const selectedDate = day.dateString;
        const foundIndex = processedDiaries.findIndex((diary) => moment(diary.diary_date).format('YYYY-MM-DD') === selectedDate);

        if (foundIndex !== -1 && processedDiaries[foundIndex].diary_id !== ADD_DIARY_CARD_ID) {
            flatListRef.current?.scrollToIndex({ index: foundIndex, animated: true, viewPosition: 0.5, });
        } else {
            showAlert('해당 날짜에 작성된 일기가 없습니다.');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#FFFFFF" className="mt-12" />;
        }
        if (containerWidth === 0) {
            return null;
        }

        return (
            <FlatList
                ref={flatListRef}
                data={processedDiaries}
                renderItem={({ item, index }) => (
                    <DiaryCard
                        item={item}
                        index={index}
                        scrollX={scrollX}
                        ITEM_WIDTH={ITEM_WIDTH}
                        ITEM_FULL_SIZE={ITEM_FULL_SIZE}
                    />
                )}
                keyExtractor={(item) => String(item.diary_id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_FULL_SIZE}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingHorizontal: PAGE_HORIZONTAL_PADDING - ITEM_GAP / 2,
                }}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: true,
                })}
                scrollEventThrottle={16}
            />
        );
    };

    return (
        <BottomLayout>
            <SafeAreaView className="flex-1 font-pretendard">
                <ScrollView className="flex-1 pt-9 font-pretendard" onLayout={onLayout}>
                    <View className="px-4 pt-12 pb-6">
                        <View className="flex-row justify-between items-center w-full mb-1">
                            <Text className="text-white text-xl font-medium leading-7">하루 일기</Text>
                            <TouchableOpacity onPress={handlePressAdd}>
                                <PlusIcon />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-gray-500 text-base font-normal leading-tight mb-6 text-left">
                            좋은 하루 보내셨나요? {'\n'}오늘 있었던 일들을 여기에서 기록해보세요
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSearchModalVisible(true)}
                            className="flex-row w-full items-center border border-gray-300 rounded-[20px] px-4 py-3 mb-16"
                        >
                            <TextInput
                                className="flex-1 text-white text-base font-normal leading-tight"
                                placeholder="날짜로 일기 검색하기"
                                placeholderTextColor="gray"
                                editable={false}
                            />
                            <SearchIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={{  height: ITEM_WIDTH * 1.5 }}>
                        {renderContent()}
                    </View>
                </ScrollView>

                <DateModal
                    isVisible={isSearchModalVisible}
                    onClose={() => setSearchModalVisible(false)}
                    onDaySelect={handleSearchDateSelect}
                    currentDate={new Date()}
                />
                {isAlertModalVisible && (
                    <Modal onClose={() => setAlertModalVisible(false)}>{alertMessage}</Modal>
                )}
            </SafeAreaView>
        </BottomLayout>
    );
}