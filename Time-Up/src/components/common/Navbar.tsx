// src/components/common/Navbar.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';

import IconAlarm from '../../../assets/images/IconAlarm.svg';
import IconCalendar from '../../../assets/images/IconCalendar.svg';
import IconDiary from '../../../assets/images/IconDiary.svg';
import IconMy from '../../../assets/images/IconMy.svg';

type TabName = 'DiaryPage' | 'AlarmPage' | 'CalendarPage' | 'MyPage';

const tabGroups: Record<TabName, string[]> = {
  DiaryPage: ['DiaryWritePage', 'DiaryPage'],
  AlarmPage: ['EditMyAlarmPage', 'MyAlarmDetailPage', 'MyAlarmPage','SelectMyAlarmReplayPage','SelectMyAlarmSoundPage','SelectMyAlarmVibratePage','EditWakeUpAlarmPage','SelectWakeupAlarmReplayPage','SelectWakeupAlarmSoundPage','SelectWakeupAlarmVibratePage','WakeUpAlarmDetailPage','WakeUpAlarmPage', ],
  CalendarPage: ['CalendarPage','AddSchedulePage','SchedulePage','SetLocationPage','SetScheduleRepeatPage','ViewScheduleDetailPage'],
  MyPage: ['MyPage', 'EditAlarmPage', 'EditInfoPage', 'FeedbackPage', ],
};

const tabs: { name: TabName; icon: any; label: string }[] = [
  { name: 'DiaryPage', icon: IconDiary, label: '일기쓰기' },
  { name: 'AlarmPage', icon: IconAlarm, label: '알람' },
  { name: 'CalendarPage', icon: IconCalendar, label: '캘린더' },
  { name: 'MyPage', icon: IconMy, label: '마이' },
];

export default function Navbar() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const renderTabs = () => (
    <View
      className="flex-row justify-between items-center h-16 w-full px-9 py-2"
      style={Platform.OS === 'web' ? { maxWidth: 474, alignSelf: 'center' } : undefined}
    >
      {tabs.map((tab) => {
        const relatedRoutes = tabGroups[tab.name] || [];
        const isActive = relatedRoutes.includes(route.name);
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            className="items-center justify-center"
            onPress={() => navigation.navigate(tab.name)}
          >
            <View
              className={`items-center justify-center rounded-full w-10 h-10 ${
                isActive ? 'bg-gray-900 p-2' : ''
              }`}
            >
              <Icon
                width={24}
                height={24}
                color={isActive ? 'white' : '#979B9F'}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View className="bg-black items-center">
      <View className="w-full h-[2px] bg-gray-500" />
      {renderTabs()}
    </View>
  );
}
