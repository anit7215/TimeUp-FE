import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import './global.css';
import AddSchedulePage from './src/pages/AddSchedulePage';
import CalendarPage from './src/pages/CalendarPage';
import LoginPage from './src/pages/LoginPage';
import MyPage from './src/pages/MyPage';
import OnBoardingPage from './src/pages/OnBoardingPage';
import SetScheduleRepeatPage from './src/pages/SetScheduleRepeatPage';




export default function App() {
  const Stack = createNativeStackNavigator();
  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
  <BottomSheetModalProvider>
    <PaperProvider>
     <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="CalendarPage"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CalendarPage" component={CalendarPage}/>
        <Stack.Screen name="OnboardingPage" component={OnBoardingPage}/>
        <Stack.Screen name="LoginPage" component={LoginPage}/>
        <Stack.Screen name="MyPage" component={MyPage}/>
        <Stack.Screen name="AddSchedulePage" component={AddSchedulePage}/>
        
        <Stack.Screen name="SetScheduleRepeatPage" component={SetScheduleRepeatPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
  </BottomSheetModalProvider>
  </GestureHandlerRootView>
  );
}
