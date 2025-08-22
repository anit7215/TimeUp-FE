// src/utils/webPush.ts
// webPush.ts (예: 앱 시작 시 1회 호출)
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAEAKbupll7pRrAuhCtI0SbHRAx-rXj7oM",
  authDomain: "timeup-80358.firebaseapp.com",
  projectId: "timeup-80358",
  messagingSenderId: "482152461783",
  appId: "1:482152461783:web:8ee854bcf8cad1ab3bc792",
};

const app = initializeApp(firebaseConfig);

export async function initWebPush() {
  const supported = await isSupported();
  if (!supported) {
    console.warn('이 브라우저는 FCM을 지원하지 않습니다.');
    return null;
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });

  const perm = await Notification.requestPermission();
  if (perm !== 'granted') {
    console.warn('알림 권한이 거부되었습니다.');
    return null;
  }

  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: 'BK6LHOnQzm8od0iib8gPwgv7K6eI43xNDDhpVRLkNTXWZ4jVfxCfaTwy-HPNqHeoiPyM3C3o7sUhPIOHBSetyUc',
    serviceWorkerRegistration: registration,
  });

  onMessage(messaging, (payload) => {
    console.log('[foreground] FCM payload:', payload);
  });

  return token;
}
