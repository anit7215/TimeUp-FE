import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type RemindSettings = {
  sound: string | null;
  vibration: string | null;
};

const REMIND_SETTINGS_KEY = 'remindAlarmSettings';
const isWeb = Platform.OS === 'web';

export const loadRemindSettings = async (): Promise<RemindSettings | null> => {
  try {
    let savedSettings: string | null = null;

    if (isWeb) {
      savedSettings = window.localStorage.getItem(REMIND_SETTINGS_KEY);
    } else {
      savedSettings = await AsyncStorage.getItem(REMIND_SETTINGS_KEY);
    }

    if (savedSettings !== null) {
      return JSON.parse(savedSettings) as RemindSettings;
    }
    return null;
  } catch (error) {
    console.error('리마인드 설정 불러오기 실패:', error);
    return null;
  }
};

export const saveRemindSettings = async (settings: RemindSettings): Promise<void> => {
  try {
    const settingsToSave = JSON.stringify(settings);

    if (isWeb) {
      window.localStorage.setItem(REMIND_SETTINGS_KEY, settingsToSave);
    } else {
      await AsyncStorage.setItem(REMIND_SETTINGS_KEY, settingsToSave);
    }
  } catch (error) {
    console.error('리마인드 설정 저장 실패:', error);
    throw error;
  }
};