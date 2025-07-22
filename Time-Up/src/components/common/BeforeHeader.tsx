import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import BeforeArrowIcon from '../../../assets/images/BeforeArrowIcon.svg';

type BeforeHeaderProps = {
  title?: string;
  rightLabel?: string;
  onRightPress?: () => void;
};

export default function BeforeHeader({ title, rightLabel, onRightPress }: BeforeHeaderProps) {
    const navigation = useNavigation();
    return (
    <View className="flex-row items-center justify-between px-4 pt-[60px] bg-black relative">
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <BeforeArrowIcon />
    </TouchableOpacity>
    <View style={{ position: 'absolute', left: 0, right: 0, top: 60, alignItems: 'center' }}>
        <Text className="font-medium text-white text-xl leading-[28px] tracking-[-0.02em] font-pretendard">
        {title}
        </Text>
    </View>

    {rightLabel ? (
        <TouchableOpacity onPress={onRightPress}>
        <Text className="text-white font-medium text-base leading-[24px] tracking-[-0.01em] font-pretendard">{rightLabel}</Text>
        </TouchableOpacity>
    ) : (
        <View className="w-8" />
    )}
    </View>
  );
}
