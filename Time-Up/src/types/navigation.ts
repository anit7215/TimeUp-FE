import { Schedule } from './schedule';
export type RootStackParamList = {
  CalendarPage: undefined;
  OnboardingPage: undefined;
  LoginPage: undefined;
  MyPage: undefined;
  ProfileSettingPage: undefined;
  AddressSearchPage: undefined;
  TestTimeScrollPage: undefined;
  TestHalfTimeScrollPage: undefined;

  ViewScheduleDetailPage: { schedule: Schedule };
  AddSchedulePage: { 
    schedule: Schedule;
    date: string;
   };
  SetLocationPage: undefined;

  SetScheduleRepeatPage: undefined;

  SetRemindAlarmPage: undefined;

};