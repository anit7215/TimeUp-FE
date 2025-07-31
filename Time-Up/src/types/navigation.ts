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
  AddSchedulePage: { selectedDate: string };
  SetLocationPage: undefined;
  SetScheduleRepeatPage: { selectedDate: string };
  SetRemindAlarmPage: undefined;
  SchedulePage: { selectedDate: string };

};