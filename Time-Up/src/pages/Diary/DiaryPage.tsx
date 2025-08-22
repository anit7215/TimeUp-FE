import Modal from '@/src/components/common/Modal';
import DateModal from '@/src/components/diary/DateModal';
import { useAlarmContext } from '@/src/contexts/AlarmContext';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import { useGetDiaryList } from '@/src/hooks/useDiaries';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import PlusIcon from '../../../assets/images/PlusIcon.svg';
import SearchIcon from '../../../assets/images/SearchIcon.svg';
import DiaryCard from '../../components/diary/DiaryCard';
import BottomLayout from '../../Layouts/BottomLayout';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACING = (width * 0.3) / 4;
const ITEM_FULL_SIZE = ITEM_WIDTH + SPACING * 2;

export default function DiaryPage() {
    const navigation = useAppNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const syncedOnceRef = useRef(false);
    const { refreshAlarms } = useAlarmContext();

    const { data: diaries = [], isLoading } = useGetDiaryList();

    //   useEffect(() => {
    
    // if (!syncedOnceRef.current) {
    //     syncedOnceRef.current = true;
    //     try {
    //         await refreshAlarms();
    //     } catch (e) {
    //         console.warn('초기 알람 동기화 실패(무시 가능):', e);
    //     }
    // }
    //   })


    const handlePressAdd = () => {
        navigation.navigate('DiaryWritePage');
    };

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertModalVisible(true);
    };

    const handleSearchDateSelect = (day: DateData) => {
        setSearchModalVisible(false);
        const selectedDate = day.dateString;
        const foundIndex = diaries.findIndex(
            (diary) => moment(diary.diary_date).format('YYYY-MM-DD') === selectedDate
        );

        if (foundIndex !== -1) {
            flatListRef.current?.scrollToIndex({
                index: foundIndex,
                animated: true,
                viewPosition: 0.5, 
            });
        } else {
            showAlert('해당 날짜에 작성된 일기가 목록에 없습니다.');
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#FFFFFF" className="mt-12" />;
        }
        if (diaries.length === 0) {
            return (
                <View className="items-center mt-12">
                    <Text className="text-white text-base text-center">
                        작성된 일기가 없습니다. {'\n'}첫 일기를 작성해보세요!
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                ref={flatListRef} 
                data={diaries}
                renderItem={({ item, index }) => <DiaryCard item={item} index={index} scrollX={scrollX} />}
                keyExtractor={(item) => String(item.diary_id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_FULL_SIZE}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingHorizontal: (width - ITEM_WIDTH) / 2,
                }}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: true,
                })}
                scrollEventThrottle={16}
            />
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <BottomLayout>
                <View className="flex-1 pt-9 font-['Pretendard']">
                    <View className="px-4">
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
                    <View>{renderContent()}</View>
                </View>
            </BottomLayout>

            <DateModal
                isVisible={isSearchModalVisible}
                onClose={() => setSearchModalVisible(false)}
                onDaySelect={handleSearchDateSelect}
                currentDate={new Date()}
            />

            {isAlertModalVisible && (
                <Modal onClose={() => setAlertModalVisible(false)}>
                    {alertMessage}
                </Modal>
            )}
        </SafeAreaView>
    );
}