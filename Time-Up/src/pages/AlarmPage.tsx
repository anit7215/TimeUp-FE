// src/pages/AlarmPage.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import useAppNavigation from '../hooks/useAppNavigation';

export default function AlarmPage() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.navigate('WakeUpAlarmPage');
  }, [navigation]);

  return <View />;
}
