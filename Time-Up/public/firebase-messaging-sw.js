// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAEAKbupll7pRrAuhCtI0SbHRAx-rXj7oM",
  authDomain: "timeup-80358.firebaseapp.com",
  projectId: "timeup-80358",
  messagingSenderId: "482152461783",
  appId: "1:482152461783:web:8ee854bcf8cad1ab3bc792",
});

const messaging = firebase.messaging();

// 앱이 닫혀있거나 백그라운드일 때 도착하는 푸시 처리
messaging.onBackgroundMessage((payload) => {
  // 서버가 notification을 보낼 수도, data만 보낼 수도 있으니 둘 다 대비
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    'Time-Up';

  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    '알림이 도착했습니다.';

  // 필요하면 아이콘/액션 추가
  self.registration.showNotification(title, {
    body,
    // icon: '/icon-192.png',
    // data: payload?.data || {},
  });
});