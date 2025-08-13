import { NotificationProvider } from '@/src/contexts/NotificationContext';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
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
import PushAlarmPage from './src/pages/Alarm/PushAlarmPage';
import SelectAlarmReplayPage from './src/pages/Alarm/SelectAlarmReplayPage';
import SelectAlarmSoundPage from './src/pages/Alarm/SelectAlarmSoundPage';
import SelectAlarmVibratePage from './src/pages/Alarm/SelectAlarmVibratePage';
import { default as EditWakeUpAlarmPage, default as WakeUpAlarmDetailPage } from './src/pages/Alarm/WakeUp/EditWakeUpAlarmPage';
import WakeUpAlarmPage from './src/pages/Alarm/WakeUp/WakeUpAlarmPage';
import CalendarPage from './src/pages/CalendarPage';
import DiaryWritePage from './src/pages/DiaryWritePage';
import EditAlarmPage from './src/pages/Mypage/EditAlarmPage';
import EditInfoPage from './src/pages/Mypage/EditInfoPage';
import FeedbackPage from './src/pages/Mypage/FeedbackPage';
import MyPage from './src/pages/Mypage/MyPage';
import AddressSearchPage from './src/pages/Onboarding/AddressSearchPage';
import OnboardingPage from './src/pages/Onboarding/OnboardingPage';
import ProfileSettingPage from './src/pages/Onboarding/ProfileSettingPage';
import SetLocationPage from './src/pages/SetLocationPage';
import SetRemindAlarmPage from './src/pages/SetPage/SetRemindAlarmPage';
import SetScheduleRepeatPage from './src/pages/SetScheduleRepeatPage';

const queryClient = new QueryClient();

export default function App() {
  const Stack = createNativeStackNavigator();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [mapsLoaded, setMapsLoaded] = useState(Platform.OS !== 'web');

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

  if (!mapsLoaded) {
    return null;
  }

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ScheduleProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="OnboardingPage" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
              <Stack.Screen name="CalendarPage" component={CalendarPage} />
              <Stack.Screen name="MyPage" component={MyPage} />
              <Stack.Screen name="WakeUpAlarmPage" component={WakeUpAlarmPage} />
              <Stack.Screen name="AlarmPage" component={AlarmPage} />
              <Stack.Screen name="DiaryWritePage" component={DiaryWritePage} />
              <Stack.Screen name="MyAlarmPage" component={MyAlarmPage} />
              <Stack.Screen name="SelectAlarmReplayPage" component={SelectAlarmReplayPage} />
              <Stack.Screen name="SelectAlarmSoundPage" component={SelectAlarmSoundPage} />
              <Stack.Screen name="SelectAlarmVibratePage" component={SelectAlarmVibratePage} />
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
          <NotificationProvider>
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
          </NotificationProvider>
        </AlarmProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}