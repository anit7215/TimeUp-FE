import { ScheduleLocalNotificationDetails } from 'react-native';
import { AddressItem } from './address';

export type RootStackParamList = {
  CalendarPage: undefined;
  OnboardingPage: undefined;
  LoginPage: undefined;
  MyPage: undefined;
  ProfileSettingPage: {
    homeAddress?: AddressItem;
    workAddress?: AddressItem;
  };
  AddressSearchPage: {
    type: 'home' | 'work';
    onSelectAddress: (address: AddressItem) => void;
  };
  EditInfoPage: undefined;
  EditAlarmPage: undefined;
  FeedbackPage: undefined;
  AlarmMemoPage: undefined;
  AlarmPage: undefined;
  EditMyAlarmPage: undefined;
  EditWakeUpAlarmPage: undefined;
  MyAlarmDetailPage: undefined;
  MyAlarmPage: undefined;
  PushAlarmPage: undefined;
  SelectAlarmReplayPage: undefined;
  SelectAlarmSoundPage: undefined;
  SelectAlarmVibratePage: undefined;
  WakeUpAlarmDetailPage: undefined;
  WakeUpAlarmPage: undefined;
  ViewScheduleDetailPage: { schedule: ScheduleLocalNotificationDetails };
  SetRemindAlarmPage: undefined;
  SetScheduleRepeatPage: undefined;
  SetLocationPage: undefined;
};
