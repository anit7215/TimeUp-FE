import { GOOGLE_PLACES_API_KEY } from '@env';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { ScheduleProvider } from './src/context/ScheduleContext';
import { AlarmProvider } from './src/contexts/AlarmContext';
import AddSchedulePage from './src/pages/AddSchedulePage';
import AlarmPage from './src/pages/Alarm/AlarmPage';
import EditMyAlarmPage from './src/pages/Alarm/My/EditMyAlarmPage';
import MyAlarmDetailPage from './src/pages/Alarm/My/MyAlarmDetailPage';
import MyAlarmPage from './src/pages/Alarm/My/MyAlarmPage';
import SelectMyAlarmReplayPage from './src/pages/Alarm/My/SelectMyAlarmReplayPage';
import SelectMyAlarmSoundPage from './src/pages/Alarm/My/SelectMyAlarmSoundPage';
import SelectMyAlarmVibratePage from './src/pages/Alarm/My/SelectMyAlarmVibratePage';
import PushAlarmPage from './src/pages/Alarm/PushAlarmPage';
import EditWakeUpAlarmPage from './src/pages/Alarm/WakeUp/EditWakeUpAlarmPage';
import SelectWakeupAlarmReplayPage from './src/pages/Alarm/WakeUp/SelectWakeupAlarmReplayPage';
import SelectWakeupAlarmSoundPage from './src/pages/Alarm/WakeUp/SelectWakeupAlarmSoundPage';
import SelectWakeupAlarmVibratePage from './src/pages/Alarm/WakeUp/SelectWakeupAlarmVibratePage';
import WakeUpAlarmDetailPage from './src/pages/Alarm/WakeUp/WakeUpAlarmDetailPage';
import WakeUpAlarmPage from './src/pages/Alarm/WakeUp/WakeUpAlarmPage';
import CalendarPage from './src/pages/CalendarPage';
import DiaryDetailPage from './src/pages/Diary/DiaryDetailPage';
import DiaryPage from './src/pages/Diary/DiaryPage';
import DiaryWritePage from './src/pages/Diary/DiaryWritePage';
import EditAlarmPage from './src/pages/Mypage/EditAlarmPage';
import EditInfoPage from './src/pages/Mypage/EditInfoPage';
import FeedbackPage from './src/pages/Mypage/FeedbackPage';
import MyPage from './src/pages/Mypage/MyPage';
import AddressSearchPage from './src/pages/Onboarding/AddressSearchPage';
import OnboardingPage from './src/pages/Onboarding/OnboardingPage';
import ProfileSettingPage from './src/pages/Onboarding/ProfileSettingPage';
import SchedulePage from './src/pages/SchedulePage';
import SetLocationPage from './src/pages/SetLocationPage';
import SetRemindAlarmPage from './src/pages/SetPage/SetRemindAlarmPage';
import SetScheduleRepeatPage from './src/pages/SetScheduleRepeatPage';
import ViewScheduleDetailPage from './src/pages/ViewScheduleDetailPage';

import { saveFCMPushToken } from './src/apis/pushToken';
import { getAccessToken } from './src/utils/storage';
import { requestWebPushToken } from './src/utils/webPush';

const queryClient = new QueryClient();

export default function App() {
  const Stack = createNativeStackNavigator();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [mapsLoaded, setMapsLoaded] = useState(Platform.OS !== 'web');
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  //const { registerForPushNotificationsAsync } = NotificationContext();
  const webPushInitRef = useRef(false);
  const nativePushInitRef = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapsLoaded(true);
      script.onerror = () => {
        console.error('Google Maps JS API 로드 실패');
        alert('주소 검색을 위한 Google Maps API 로드에 실패했습니다.');
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    setInitialRoute(token ? 'CalendarPage' : 'OnboardingPage'); 
  }, []);

//   // 앱 토큰 발급
//   useEffect(() => {
//   if (Platform.OS === 'web') return;
//   if (nativePushInitRef.current) return;
//   nativePushInitRef.current = true;

//   let cancelled = false;

//   (async () => {
//     try {
//       // 기기 권한 요청 + Expo push token 발급
//       const token = await registerForPushNotificationsAsync();
//       if (!token || cancelled) return;

//       // 로그인 토큰 없으면 서버 저장 skip (선택)
//       const access = await getAccessToken();
//       if (!access) {
//         console.warn('로그인 토큰 없음: push-token 저장 생략');
//         return;
//       }

//       // 서버 저장
//       // const res = await saveExpoPushToken(token);
//       // if ((res as any)?.result === 'Error') {
//       //   console.warn('push-token 저장 실패:', (res as any)?.error);
//       // } else {
//       //   console.log('push-token 저장 성공');
//       // }
//     } catch (e) {
//       console.warn('모바일 푸시 토큰 발급/저장 실패:', e);
//     }
//   })();

//   return () => { cancelled = true; };
// }, []);

  useEffect(() => {
    //debugger;
    if (Platform.OS !== 'web') return;
    if (webPushInitRef.current) return;
    webPushInitRef.current = true;
    let cancelled = false;

    (async () => {
      debugger;
      try {
        const token = await requestWebPushToken();
        if (!token || cancelled) {
          console.warn('웹 푸시 권한 거부 또는 토큰 없음');
          return;
        }
        console.log('Web FCM Token:', token);

          const res = await saveFCMPushToken(token);
          if ((res as any)?.result === 'Error') {
            console.warn('웹 push-token 저장 실패:', (res as any)?.error);
          } else {
            console.log('웹 push-token 저장 성공');
          }
        } catch (e) {
          console.warn('웹 푸시 토큰 발급/저장 실패:', e);
        }
      })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mapsLoaded || !initialRoute) return null;
  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ScheduleProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
              <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
              <Stack.Screen name="CalendarPage" component={CalendarPage} />
              <Stack.Screen name="MyPage" component={MyPage} />
              <Stack.Screen name="WakeUpAlarmPage" component={WakeUpAlarmPage} />
              <Stack.Screen name="AlarmPage" component={AlarmPage} />
              <Stack.Screen name="DiaryPage" component={DiaryPage} />
              <Stack.Screen name="DiaryDetailPage" component={DiaryDetailPage} />
              <Stack.Screen name="DiaryWritePage" component={DiaryWritePage} />
              <Stack.Screen name="MyAlarmPage" component={MyAlarmPage} />
              <Stack.Screen name="SelectMyAlarmReplayPage" component={SelectMyAlarmReplayPage} />
              <Stack.Screen name="SelectMyAlarmSoundPage" component={SelectMyAlarmSoundPage} />
              <Stack.Screen name="SelectMyAlarmVibratePage" component={SelectMyAlarmVibratePage} />
              <Stack.Screen name="WakeUpAlarmDetailPage" component={WakeUpAlarmDetailPage} />
              <Stack.Screen name="EditWakeUpAlarmPage" component={EditWakeUpAlarmPage} />
              <Stack.Screen name="MyAlarmDetailPage" component={MyAlarmDetailPage} />
              <Stack.Screen name="EditMyAlarmPage" component={EditMyAlarmPage} />
              <Stack.Screen name="PushAlarmPage" component={PushAlarmPage} />
              <Stack.Screen name="AddressSearchPage" component={AddressSearchPage} />
              <Stack.Screen name="ProfileSettingPage" component={ProfileSettingPage} />
              <Stack.Screen name="EditInfoPage" component={EditInfoPage} />
              <Stack.Screen name="EditAlarmPage" component={EditAlarmPage} />
              <Stack.Screen name="FeedbackPage" component={FeedbackPage} />
              <Stack.Screen name="AddSchedulePage" component={AddSchedulePage} />
              <Stack.Screen name="SetLocationPage" component={SetLocationPage} />
              <Stack.Screen name="SetScheduleRepeatPage" component={SetScheduleRepeatPage} />
              <Stack.Screen name="SetRemindAlarmPage" component={SetRemindAlarmPage} />
              <Stack.Screen name="SchedulePage" component={SchedulePage} />
              <Stack.Screen name="ViewScheduleDetailPage" component={ViewScheduleDetailPage} />
              <Stack.Screen name="SelectWakeupAlarmReplayPage" component={SelectWakeupAlarmReplayPage} />
              <Stack.Screen name="SelectWakeupAlarmSoundPage" component={SelectWakeupAlarmSoundPage} />
              <Stack.Screen name="SelectWakeupAlarmVibratePage" component={SelectWakeupAlarmVibratePage} />
            </Stack.Navigator>
          </NavigationContainer>
        </ScheduleProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <AlarmProvider>
            <SafeAreaView
              edges={['top', 'bottom']}
              className="flex-1 bg-black"
              style={{
                width: Platform.OS === 'web' && screenWidth > 474 ? 474 : '100%',
                height: screenHeight,
                alignSelf: Platform.OS === 'web' ? 'center' : 'auto',
              }}
            >
              {content}
            </SafeAreaView>
        </AlarmProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}