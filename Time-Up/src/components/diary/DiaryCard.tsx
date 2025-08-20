import useAppNavigation from '@/src/hooks/useAppNavigation';
import React, { FC } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import ArrowIcon from '../../../assets/images/arrow-narrow-right.svg';
import { DiaryItem } from '../../types/diary';

export const ADD_DIARY_CARD_ID = 'add-today-diary';

interface DiaryCardProps {
    item: DiaryItem;
    index: number;
    scrollX: Animated.Value;
    ITEM_WIDTH: number;
    ITEM_FULL_SIZE: number;
}

const DiaryCard: FC<DiaryCardProps> = ({ item, index, scrollX, ITEM_WIDTH, ITEM_FULL_SIZE }) => {
    const navigation = useAppNavigation();
    const inputRange = [
        (index - 1) * ITEM_FULL_SIZE,
        index * ITEM_FULL_SIZE,
        (index + 1) * ITEM_FULL_SIZE,
    ];

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.85, 1, 0.85],
        extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [26, 0, 26],
        extrapolate: 'clamp',
    });

    const animatedStyle = {
        transform: [{ scale }, { translateY }],
    };

    const dynamicContainerStyle = {
        width: ITEM_WIDTH,
        marginHorizontal: 6,
    };

    if (item.diary_id === ADD_DIARY_CARD_ID) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('DiaryWritePage')}
            >
                <Animated.View
                    style={[dynamicContainerStyle, animatedStyle]}
                    className="h-full items-center justify-center"
                >
                    <View className="h-full w-full min-h-[332px] min-w-[224px] bg-dark border border-dark-stroke rounded-[20px] p-5 items-center justify-center">
                        <Text className="text-white text-lg font-medium leading-relaxed text-center mb-4">
                            오늘의 일기가 없습니다.
                        </Text>
                        <View className="gap-2 mt-20 flex flex-row items-center">
                          <Text className="text-light text-base font-medium leading-normal text-center">
                            작성하러 이동하기
                          </Text>
                        <ArrowIcon/>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    }

    const date = new Date(item.diary_date);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('DiaryDetailPage', { diary: item })}
        >
            <Animated.View
                style={[dynamicContainerStyle, animatedStyle]}
                className="h-full items-center justify-center"
            >
                <View className="h-full w-full min-h-[332px] min-w-[224px] rounded-[20px] bg-dark border border-dark-stroke px-5 py-7">
                    <Text className="text-white text-sm font-normal mb-2 leading-tight font-pretendard">{formattedDate}</Text>
                    <Text className="text-white text-base font-medium leading-normal mb-2 font-pretendard">{item.title}</Text>
                    <Text className="self-stretch text-white text-sm font-normal leading-[20px] font-pretendard">{item.content}</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default DiaryCard;