import useAppNavigation from '@/src/hooks/useAppNavigation';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import GoogleIcon from '../../../assets/images/GoogleIcon.svg';
import IconImage from '../../../assets/images/Icon.svg';

export default function OnboardingPage() {

  const navigation = useAppNavigation();
  return (
    <View className="flex-1 items-center pt-[208px] bg-black">
      <IconImage/>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileSettingPage', {
          homeAddress: undefined,
          workAddress: undefined,
        })}
        className="w-[200px] h-[36px] bg-white rounded-full mt-[39px] px-3 py-4 justify-center border border-[#C1D5F6]">
        <View className="flex-row items-center justify-center gap-[10px]">
          <GoogleIcon width={18} height={18}/>
          <Text className="text-[#1F1F1F] text-sm font-roboto font-medium">Sign in with Google</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}