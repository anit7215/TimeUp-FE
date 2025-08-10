
// src/components/common/Navbar.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';

import IconAlarm from '../../../assets/images/IconAlarm.png';
import IconCalendar from '../../../assets/images/IconCalendar.png';
import IconDiary from '../../../assets/images/IconDiary.png';
import IconMy from '../../../assets/images/IconMy.png';

type TabName = 'DiaryWritePage' | 'AlarmPage' | 'CalendarPage' | 'MyPage';

// 탭의 소속 페이지 그룹 정의. 페이지 만들 때마다 여기에 추가!!
const tabGroups: Record<TabName, string[]> = {
  DiaryWritePage: ['DiaryWritePage'],
  AlarmPage: ['WakeUpAlarmPage', 'MyAlarmDetailPage', 'MyAlarmPage',
     'WakeUpAlarmDetailPage', 'SelectAlarmSoundPage', 'SelectAlarmReplayPage',
     'SelectAlarmVibratePage', 'EditWakeUpAlarmPage', 'EditMyAlarmPage',
     'PushAlarmPage',],
  CalendarPage: ['CalendarPage'],
  MyPage: ['MyPage'],
};

const tabs: { name: TabName; icon: any; label: string }[] = [
  { name: 'DiaryWritePage', icon: IconDiary, label: '일기쓰기' },
  { name: 'AlarmPage', icon: IconAlarm, label: '알람' },
  { name: 'CalendarPage', icon: IconCalendar, label: '캘린더' },
  { name: 'MyPage', icon: IconMy, label: '마이' },
];

export default function Navbar() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const renderTabs = () => (
    <View
      className="flex-row justify-around items-center h-16"
      style={Platform.OS === 'web' ? { width: 474, alignSelf: 'center' } : undefined}
    >
      {tabs.map((tab) => {
        const relatedRoutes = tabGroups[tab.name] || [];
        const isActive = relatedRoutes.includes(route.name);

        return (
          <TouchableOpacity
            key={tab.name}
            className="flex-1 items-center justify-center"
            onPress={() => navigation.navigate(tab.name)}
          >
            <Image
              source={tab.icon}
              style={{
                width: 24,
                height: 24,
                tintColor: isActive ? 'white' : '#979B9F',
              }}
              resizeMode="contain"
            />
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
