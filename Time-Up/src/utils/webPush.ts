// src/utils/webPush.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAEAKbupll7pRrAuhCtI0SbHRAx-rXj7oM",
  authDomain: "timeup-80358.firebaseapp.com",
  projectId: "timeup-80358",
  messagingSenderId: "482152461783",
  appId: "1:482152461783:web:8ee854bcf8cad1ab3bc792",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// 1) 푸시 권한 요청 + 2) 서비스워커 등록 + 3) FCM 웹 토큰 발급
// export async function requestWebPushToken(): Promise<string | null> {
//   if (!('Notification' in window)) return null;

//   const permission = await Notification.requestPermission();
//   if (permission !== 'granted') return null;

//   // 이미 public/index.html에서 /firebase-messaging-sw.js 를 등록했지만,
//   // 안전하게 등록 객체를 getToken에 넘겨 위치를 명시. (Firebase 공식 지원)
//   const registration = await navigator.serviceWorker.getRegistration('/') 
//                     ?? await navigator.serviceWorker.register('/firebase-messaging-sw.js');

//   const token = await getToken(messaging, {
//     vapidKey: 'BK6LHOnQzm8od0iib8gPwgv7K6eI43xNDDhpVRLkNTXWZ4jVfxCfaTwy-HPNqHeoiPyM3C3o7sUhPIOHBSetyUc',
//     serviceWorkerRegistration: registration,
//   });

//   return token || null;
// }

export async function requestWebPushToken(): Promise<string | null> {
  if (!('Notification' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('웹 푸시 권한 거부됨');
    return null;
  }

  let registration = await navigator.serviceWorker.getRegistration('/');
  if (!registration) {
    registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
  }

  // 2) 활성화(ready)까지 대기
  await navigator.serviceWorker.ready;

  try {
    const token = await getToken(messaging, {
      vapidKey: 'BK6LHOnQzm8od0iib8gPwgv7K6eI43xNDDhpVRLkNTXWZ4jVfxCfaTwy-HPNqHeoiPyM3C3o7sUhPIOHBSetyUc',
      serviceWorkerRegistration: registration,
    });
    if (!token) {
      console.warn('토큰이 비어 있음 (권한/HTTPS/도메인/스코프 확인 필요)');
      return null;
    }
    console.log('Web FCM Token:', token); // 정상 발급
    return token;
  } catch (e: any) {
    console.error('getToken 실패:', e?.code, e?.message, e);
    return null;
  }
}

