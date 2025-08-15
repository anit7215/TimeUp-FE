import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const FEEDBACK_KEY_PREFIX = 'feedback_submitted_';

export const markFeedbackSubmitted = async (alarmId: number): Promise<void> => {
  const key = `${FEEDBACK_KEY_PREFIX}${alarmId}`;
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, 'true');
    } else {
      await AsyncStorage.setItem(key, 'true');
    }
  } catch (error) {
    console.error('피드백 제출 상태 저장 실패:', error);
  }
};

export const hasSubmittedFeedback = async (alarmId: number): Promise<boolean> => {
  const key = `${FEEDBACK_KEY_PREFIX}${alarmId}`;
  try {
    let result: string | null = null;
    if (Platform.OS === 'web') {
      result = localStorage.getItem(key);
    } else {
      result = await AsyncStorage.getItem(key);
    }
    return result === 'true';
  } catch (error) {
    console.error('피드백 제출 상태 불러오기 실패:', error);
    return false;
  }
};