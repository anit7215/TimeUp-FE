import AsyncStorage from '@react-native-async-storage/async-storage';

export type AutoAlarmSettings = {
  alarmSound: string | null;
  vibrationType: string | null;
  interval: string | null;
  repeatCount: string | null;
  alarmTime: { hour: string; minute: string } | null;
};

const STORAGE_KEY = '@auto_alarm_settings';

export const saveAutoAlarmSettings = async (settings: AutoAlarmSettings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('자동 알람 저장 실패:', e);
  }
};

export const loadAutoAlarmSettings = async (): Promise<AutoAlarmSettings | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('자동 알람 불러오기 실패:', e);
    return null;
  }
};
