import { axiosInstance } from '@/src/apis/axiosInstance';
import useAppNavigation from '@/src/hooks/useAppNavigation';
import { useProfileStore } from '@/src/stores/useProfileStore';
import { setAccessToken, setRefreshToken } from '@/src/utils/storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef } from 'react';
import { Alert, Animated, Text, TouchableOpacity, View } from 'react-native';
import GoogleIcon from '../../../assets/images/GoogleIcon.svg';
import IconImage from '../../../assets/images/Icon.svg';
import { login } from '../../apis/auth';

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingPage() {
  const navigation = useAppNavigation();
  const { setField } = useProfileStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email', 'https://www.googleapis.com/auth/calendar',],
  });
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchLogin = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;

        if (!authentication?.accessToken) {
          Alert.alert('로그인 실패', '액세스 토큰이 없습니다.');
          return;
        }

        try {
          const userInfoRes = await axiosInstance.get('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
              Authorization: `Bearer ${authentication.accessToken}`,
            },
          });
          const userInfo = userInfoRes.data;
          if (userInfo?.picture) {
            setField('profileImage', userInfo.picture);
          }

          const data = await login(authentication.accessToken);

          if (data.success?.accessToken) {
            setAccessToken(data.success.accessToken);
          }
          if (data.success?.refreshToken) {
            setRefreshToken(data.success.refreshToken);
          }
          if (data.success?.isNew) {
            navigation.navigate('ProfileSettingPage',{});
          } else {
            navigation.navigate('CalendarPage'); 
          }
        } catch (error: any) {
          console.error('로그인 요청 실패:', error);
          Alert.alert('에러', error.response?.data?.message || '네트워크 오류가 발생했습니다.');
        }
      }
    };

    fetchLogin();
  }, [response, navigation, setField]);

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 2000, 
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 items-center pt-[208px] bg-black gap-3">
      <IconImage/>
      <Animated.View style={{ opacity: opacityAnim,position: 'absolute', bottom: 50 }}>
      <TouchableOpacity
        disabled={!request}
        onPress={() => promptAsync()}
        className="bg-[#ffffff] rounded-full px-8 py-3 justify-center">
        <View className="flex-row items-center justify-center gap-[10px]">
          <GoogleIcon width={18} height={18} />
          <Text className="text-[#1F1F1F] text-base font-roboto font-medium leading-normal">Sign in with Google</Text>
        </View>
      </TouchableOpacity>
      </Animated.View>
    </View>
  );
}