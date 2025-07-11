import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import AlarmMemoPage from './src/pages/AlarmMemoPage';
import AlarmPage from './src/pages/AlarmPage';
import CalendarPage from './src/pages/CalendarPage';
import DiaryWritePage from './src/pages/DiaryWritePage';
import EditMyAlarmPage from './src/pages/EditMyAlarmPage';
import EditWakeUpAlarmPage from './src/pages/EditWakeUpAlarmPage';
import LoginPage from './src/pages/LoginPage';
import MyAlarmDetailPage from './src/pages/MyAlarmDetailPage';
import MyAlarmPage from './src/pages/MyAlarmPage';
import MyPage from './src/pages/MyPage';
import OnboardingPage from './src/pages/OnboardingPage';
import PushAlarmPage from './src/pages/PushAlarmPage';
import SelectAlarmDatePage from './src/pages/SelectAlarmDatePage';
import SelectAlarmReplayPage from './src/pages/SelectAlarmReplayPage';
import SelectAlarmSoundPage from './src/pages/SelectAlarmSoundPage';
import SelectAlarmTimePage from './src/pages/SelectAlarmTimePage';
import SelectAlarmVibratePage from './src/pages/SelectAlarmVibratePage';
import WakeUpAlarmDetail from './src/pages/WakeUpAlarmDetail';
import WakeUpAlarmPage from './src/pages/WakeUpAlarmPage';
import WakeUpAlarmPageNotAuto from './src/pages/WakeUpAlarmPageNotAuto';

// 화면 높이 가져오기
const screenHeight = Dimensions.get('window').height;

export default function App() {
  const Stack = createNativeStackNavigator();

  const content = (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PushAlarmPage" screenOptions={{ headerShown: false }}>
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
