import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import AlarmPage from './src/pages/AlarmPage';
import CalendarPage from './src/pages/CalendarPage';
import DiaryWritePage from './src/pages/DiaryWritePage';
import MyPage from './src/pages/Mypage/MyPage';
import AddressSearchPage from './src/pages/Onboarding/AddressSearchPage';
import OnboardingPage from './src/pages/Onboarding/OnboardingPage';
import ProfileSettingPage from './src/pages/Onboarding/ProfileSettingPage';
import TestHalfTimeScrollPage from './src/pages/TestHalfTimeScrollPage';
import TestTimeScrollPage from './src/pages/TestTimeScrollPage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const content = (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnboardingPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
        <Stack.Screen name="CalendarPage" component={CalendarPage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="AlarmPage" component={AlarmPage} />
        <Stack.Screen name="DiaryWritePage" component={DiaryWritePage} />
        <Stack.Screen name="TestTimeScrollPage" component={TestTimeScrollPage} />
        <Stack.Screen name="TestHalfTimeScrollPage" component={TestHalfTimeScrollPage} />
        <Stack.Screen name="AddressSearchPage" component={AddressSearchPage} />
        <Stack.Screen name="ProfileSettingPage" component={ProfileSettingPage} />
      </Stack.Navigator>
    </NavigationContainer>
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
