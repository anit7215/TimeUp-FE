import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import BottomLayout from './src/Layouts/BottomLayout';
import AddSchedulePage from './src/pages/AddSchedulePage';
import CalendarPage from './src/pages/CalendarPage';
import MyPage from './src/pages/Mypage/MyPage';
import AddressSearchPage from './src/pages/Onboarding/AddressSearchPage';
import OnboardingPage from './src/pages/Onboarding/OnboardingPage';
import ProfileSettingPage from './src/pages/Onboarding/ProfileSettingPage';
import SchedulePage from './src/pages/SchedulePage';
import SetLocationPage from './src/pages/SetLocationPage';
import SetRemindAlarmPage from './src/pages/SetPage/SetRemindAlarmPage';
import SetScheduleRepeatPage from './src/pages/SetScheduleRepeatPage';
import TestHalfTimeScrollPage from './src/pages/TestHalfTimeScrollPage';
import TestTimeScrollPage from './src/pages/TestTimeScrollPage';
import ViewScheduleDetailPage from './src/pages/ViewScheduleDetailPage';
import { RootStackParamList } from './src/types/navigation';
import { ScheduleProvider } from './src/context/ScheduleContext';

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
      <ScheduleProvider>
      <PaperProvider> 
        <NavigationContainer>
      <Stack.Navigator initialRouteName="CalendarPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
        <Stack.Screen name="CalendarPage" 
          component={() => (
            <BottomLayout>
              <CalendarPage />
            </BottomLayout>
          )} />
        <Stack.Screen name="SchedulePage"
          component={() => (
            <BottomLayout>
              <SchedulePage />
            </BottomLayout>
          )} />
        <Stack.Screen name="ViewScheduleDetailPage"
          component={() => (
            <BottomLayout>
              <ViewScheduleDetailPage />
            </BottomLayout>
          )} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="TestTimeScrollPage" component={TestTimeScrollPage} />
        <Stack.Screen name="TestHalfTimeScrollPage" component={TestHalfTimeScrollPage} />
        <Stack.Screen name="AddressSearchPage" component={AddressSearchPage} />
        <Stack.Screen name="ProfileSettingPage" component={ProfileSettingPage} />
        <Stack.Screen name="SetLocationPage" component={SetLocationPage}/>
        <Stack.Screen name="AddSchedulePage" component={() => (
            <BottomLayout>
              <AddSchedulePage />
            </BottomLayout>
          )} />
        <Stack.Screen name="SetScheduleRepeatPage"           component={() => (
            <BottomLayout>
              <SetScheduleRepeatPage />
            </BottomLayout>
          )} />
        <Stack.Screen name="SetRemindAlarmPage" component={SetRemindAlarmPage} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    </ScheduleProvider>
  </BottomSheetModalProvider>
  </GestureHandlerRootView>
  );

  return (
    <PaperProvider>
      <SafeAreaView
        style={{
          width: screenWidth > 474 ? 474 : '100%',
          height: screenHeight,
          alignSelf: 'center',
        }}
      >
        {content}
      </SafeAreaView>
    </PaperProvider>
  );
}
