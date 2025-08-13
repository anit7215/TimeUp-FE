// src/utils/notification.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 앱이 포그라운드일 때 알림 표시 방식
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // 전체 alert
    shouldPlaySound: true,      // 사운드
    shouldSetBadge: false,      // 앱 아이콘 배지

    // iOS 15+에서 필요한 새로운 필드
    shouldShowBanner: true,     // 배너 표시
    shouldShowList: true        // 알림 센터 리스트 표시
  }),
});

// Expo Push Token 발급 + 안드 채널 설정
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    alert('푸시 알림은 실제 기기에서만 작동합니다.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('푸시 알림 권한이 거부되었습니다.');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '기본',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return token;
}

// 개발 중 로컬 알림 테스트용 (원하면 삭제해도 됨)
export async function triggerLocalNotificationTest(payload?: Record<string, any>) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'TimeUp 알림',
      body: '로컬 테스트 알림입니다.',
      data: payload ?? { source: 'local-test' },
    },
    trigger: null, // 즉시
  });
}
