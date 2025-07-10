import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import AlarmPage from './src/pages/AlarmPage';
import CalendarPage from './src/pages/CalendarPage';
import DiaryWritePage from './src/pages/DiaryWritePage';
import LoginPage from './src/pages/LoginPage';
import MyPage from './src/pages/MyPage';
import OnboardingPage from './src/pages/OnboardingPage';
import TestHalfTimeScrollPage from './src/pages/TestHalfTimeScrollPage';
import TestTimeScrollPage from './src/pages/TestTimeScrollPage';

// 화면 높이 가져오기
const screenHeight = Dimensions.get('window').height;

export default function App() {
  const Stack = createNativeStackNavigator();

  const content = (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnboardingPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
        <Stack.Screen name="CalendarPage" component={CalendarPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="AlarmPage" component={AlarmPage} />
        <Stack.Screen name="DiaryWritePage" component={DiaryWritePage} />
        <Stack.Screen name="TestTimeScrollPage" component={TestTimeScrollPage} />
        <Stack.Screen name="TestHalfTimeScrollPage" component={TestHalfTimeScrollPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return (
    <PaperProvider>
      {Platform.OS === 'web' ? (
        <SafeAreaView
          style={{
            width: 474,
            height: screenHeight,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
          }}
        >
          {content}
        </SafeAreaView>
      ) : (
        content
      )}
    </PaperProvider>
    );
  }
