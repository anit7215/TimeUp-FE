
import { AddressItem } from './address';
import ViewScheduleDetailPage from '../pages/ViewScheduleDetailPage';
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
  SelectMyAlarmReplayPage: undefined;
  SelectMyAlarmSoundPage: undefined;
  SelectMyAlarmVibratePage: undefined;
  WakeUpAlarmDetailPage: undefined;
  WakeUpAlarmPage: undefined;
  SetRemindAlarmPage: undefined;
  SetScheduleRepeatPage: undefined;
  SetLocationPage: undefined;
  ViewScheduleDetailPage: undefined;
  SelectWakeupAlarmReplayPage: undefined;
  SelectWakeupAlarmSoundPage: undefined;
  SelectWakeupAlarmVibratePage: undefined;
};
