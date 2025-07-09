import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import CalendarPage from './src/pages/CalendarPage';
import LoginPage from './src/pages/LoginPage';
import MyPage from './src/pages/MyPage';
import AddressSearchPage from './src/pages/Onboarding/AddressSearchPage';
import OnboardingPage from './src/pages/Onboarding/OnboardingPage';
import ProfileSettingPage from './src/pages/Onboarding/ProfileSettingPage';

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
        <Stack.Screen name="ProfileSettingPage" component={ProfileSettingPage}/>
        <Stack.Screen name="AddressSearchPage" component={AddressSearchPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  );
}
