// src/contexts/NotificationContext.tsx
// import { saveExpoPushToken } from '@/src/apis/pushToken';
// import { useAlarmContext } from '@/src/contexts/AlarmContext';
// import { registerForPushNotificationsAsync } from '@/src/utils/notification';
// import * as Notifications from 'expo-notifications';
// import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// interface NotificationContextValue {
//   expoPushToken: string | null;
//   lastNotification: Notifications.Notification | null;
// }

// const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
//   const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);
//   const receivedListener = useRef<Notifications.Subscription | null>(null);
//   const responseListener = useRef<Notifications.Subscription | null>(null);

//   const { updateAlarmField } = useAlarmContext();

//   //debugger;
//   //console.log('NotificationProvider 렌더링됨');
//   useEffect(() => {
//     (async () => {
//       const token = await registerForPushNotificationsAsync();
//       if (token) {
//         setExpoPushToken(token);
//         try {
//           await saveExpoPushToken(token);
//           console.log('Expo Push Token 저장 완료:', token);
//         } catch (e) {
//           console.warn('푸시 토큰 저장 실패:', e);
//         }
//       }
//     })();

//     // 앱이 포그라운드에서 알림 수신
//     receivedListener.current = Notifications.addNotificationReceivedListener((notification) => {
//       setLastNotification(notification);
//       // 서버가 보내는 데이터 형식에 맞춰 처리해야 함. 수정 필요.
//       const data: any = notification.request.content.data || {};
//       // 예시임: { type: 'ALARM_STATUS', alarm_id: 123, isActive: true }
//       if (data.type === 'ALARM_STATUS' && typeof data.alarm_id === 'number') {
//         updateAlarmField(data.alarm_id, 'isActive', !!data.isActive);
//       }
//     });

//     // 사용자가 알림 클릭한 경우
//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//       const data: any = response.notification.request.content.data || {};
//       // 알림 탭 시 특정 알람 상세로 이동하려면 여기에서 navigation 처리
//       // ex) navigate('MyAlarmDetailPage') 등
//       // 자동, 기상, 내 알람 별로 분기 처리 필요.
//       console.log('알림 클릭 응답:', data);
//     });

//     return () => {
//       receivedListener.current?.remove();
//       responseListener.current?.remove();
//     };
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ expoPushToken, lastNotification }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotificationContext = () => {
//   const ctx = useContext(NotificationContext);
//   if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
//   return ctx;
// };
