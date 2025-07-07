import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import CalendarPage from './src/pages/CalendarPage';
import LoginPage from './src/pages/LoginPage';
import MyPage from './src/pages/MyPage';
import OnBoardingPage from './src/pages/OnBoardingPage';


export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <PaperProvider>
     <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="CalendarPage"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CalendarPage" component={CalendarPage}/>
        <Stack.Screen name="OnboardingPage" component={OnBoardingPage}/>
        <Stack.Screen name="LoginPage" component={LoginPage}/>
        <Stack.Screen name="MyPage" component={MyPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
}
