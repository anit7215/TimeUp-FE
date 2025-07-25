import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Platform, useWindowDimensions } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import AlarmMemoPage from './src/pages/Alarm/AlarmMemoPage';
import AlarmPage from './src/pages/Alarm/AlarmPage';
import EditMyAlarmPage from './src/pages/Alarm/EditMyAlarmPage';
import EditWakeUpAlarmPage from './src/pages/Alarm/EditWakeUpAlarmPage';
import MyAlarmDetailPage from './src/pages/Alarm/MyAlarmDetailPage';
import MyAlarmPage from './src/pages/Alarm/MyAlarmPage';
import PushAlarmPage from './src/pages/Alarm/PushAlarmPage';
import SelectAlarmDatePage from './src/pages/Alarm/SelectAlarmDatePage';
import SelectAlarmReplayPage from './src/pages/Alarm/SelectAlarmReplayPage';
import SelectAlarmSoundPage from './src/pages/Alarm/SelectAlarmSoundPage';
import SelectAlarmTimePage from './src/pages/Alarm/SelectAlarmTimePage';
import SelectAlarmVibratePage from './src/pages/Alarm/SelectAlarmVibratePage';
import WakeUpAlarmDetail from './src/pages/Alarm/WakeUpAlarmDetail';
import WakeUpAlarmPage from './src/pages/Alarm/WakeUpAlarmPage';
import WakeUpAlarmPageNotAuto from './src/pages/Alarm/WakeUpAlarmPageNotAuto';
import CalendarPage from './src/pages/CalendarPage';
import DiaryWritePage from './src/pages/DiaryWritePage';
import LoginPage from './src/pages/LoginPage';
import MyPage from './src/pages/MyPage';
import OnboardingPage from './src/pages/OnboardingPage';

// 화면 높이 가져오기
const screenHeight = Dimensions.get('window').height;

export default function App() {
  const Stack = createNativeStackNavigator();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const content = (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MyAlarmDetailPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OnboardingPage" component={OnboardingPage} />
        <Stack.Screen name="CalendarPage" component={CalendarPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="WakeUpAlarmPage" component={WakeUpAlarmPage} />
        <Stack.Screen name="WakeUpAlarmPageNotAuto" component={WakeUpAlarmPageNotAuto} />
        <Stack.Screen name="AlarmPage" component={AlarmPage} />
        <Stack.Screen name="DiaryWritePage" component={DiaryWritePage} />
        <Stack.Screen name="MyAlarmPage" component={MyAlarmPage} />
        <Stack.Screen name="SelectAlarmReplayPage" component={SelectAlarmReplayPage} />
        <Stack.Screen name="SelectAlarmSoundPage" component={SelectAlarmSoundPage} />
        <Stack.Screen name="SelectAlarmVibratePage" component={SelectAlarmVibratePage} />
        <Stack.Screen name="AlarmMemoPage" component={AlarmMemoPage} />
        <Stack.Screen name="WakeUpAlarmDetail" component={WakeUpAlarmDetail} />
        <Stack.Screen name="EditWakeUpAlarmPage" component={EditWakeUpAlarmPage} />
        <Stack.Screen name="MyAlarmDetailPage" component={MyAlarmDetailPage} />
        <Stack.Screen name="EditMyAlarmPage" component={EditMyAlarmPage} />
        <Stack.Screen name="SelectAlarmDatePage" component={SelectAlarmDatePage} />
        <Stack.Screen name="SelectAlarmTimePage" component={SelectAlarmTimePage} />
        <Stack.Screen name="PushAlarmPage" component={PushAlarmPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );

  return (
    <PaperProvider>
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
    </PaperProvider>
  );
}