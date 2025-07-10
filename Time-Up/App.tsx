import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import './global.css';
import AlarmPage from './src/pages/AlarmPage';
import CalendarPage from './src/pages/CalendarPage';
import DiaryWritePage from './src/pages/DiaryWritePage';
import LoginPage from './src/pages/LoginPage';
import MyPage from './src/pages/MyPage';
import OnboardingPage from './src/pages/OnboardingPage';
import TestHalfTimeScrollPage from './src/pages/TestHalfTimeScrollPage';
import TestTimeScrollPage from './src/pages/TestTimeScrollPage';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <PaperProvider>
     <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="OnboardingPage"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CalendarPage" component={CalendarPage}/>
        <Stack.Screen name="OnboardingPage" component={OnboardingPage}/>
        <Stack.Screen name="LoginPage" component={LoginPage}/>
        <Stack.Screen name="MyPage" component={MyPage}/>
        <Stack.Screen name="AlarmPage" component={AlarmPage}/>
        <Stack.Screen name="DiaryWritePage" component={DiaryWritePage}/>
        <Stack.Screen name="TestTimeScrollPage" component={TestTimeScrollPage}/>
        <Stack.Screen name="TestHalfTimeScrollPage" component={TestHalfTimeScrollPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
}
