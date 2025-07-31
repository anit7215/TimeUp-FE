import useAppNavigation from '@/src/hooks/useAppNavigation';
import { setAccessToken, setRefreshToken } from '@/src/utils/storage';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import GoogleIcon from '../../../assets/images/GoogleIcon.svg';
import IconImage from '../../../assets/images/Icon.svg';
import { login } from '../../apis/auth';

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingPage() {
  const navigation = useAppNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.GOOGLE_CLIENT_ID,
    iosClientId: process.env.GOOGLE_CLIENT_ID,
    androidClientId: process.env.GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    const fetchLogin = async () => {
      if (response?.type === 'success') {
        const { authentication } = response;

        if (!authentication?.accessToken) {
          Alert.alert('로그인 실패', '액세스 토큰이 없습니다.');
          return;
        }

        try {
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
            navigation.navigate('AlarmPage');
          }
        } catch (error: any) {
          console.error('로그인 요청 실패:', error);
          Alert.alert('에러', error.response?.data?.message || '네트워크 오류가 발생했습니다.');
        }
      }
    };

    fetchLogin();
  }, [response, navigation]);

  return (
    <View className="flex-1 items-center pt-[208px] bg-black">
      <IconImage/>
      <TouchableOpacity
        disabled={!request}
        onPress={() => promptAsync()}
        className="w-[200px] h-[36px] bg-white rounded-full mt-[39px] px-3 py-3 justify-center border border-[#C1D5F6]">
        <View className="flex-row items-center justify-center gap-[10px]">
          <GoogleIcon width={18} height={18} />
          <Text className="text-[#1F1F1F] text-sm font-roboto font-medium">Sign in with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}