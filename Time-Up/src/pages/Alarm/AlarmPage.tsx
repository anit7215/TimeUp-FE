// src/pages/AlarmPage.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import useAppNavigation from '../../hooks/useAppNavigation';

export default function AlarmPage() {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.navigate('WakeUpAlarmPage');
  }, [navigation]);

  return <View />;
}

// // src/pages/AlarmPage.tsx
// import { useAlarmContext } from '@/src/contexts/AlarmContext';
// import React, { useEffect, useRef } from 'react';
// import { View } from 'react-native';
// import useAppNavigation from '../../hooks/useAppNavigation';

// export default function AlarmPage() {
//   const navigation = useAppNavigation();
//   const { refreshAlarms } = useAlarmContext();
//   const syncedOnceRef = useRef(false);

//   useEffect(() => {
//     // 알람 동기화
//     if (!syncedOnceRef.current) {
//       syncedOnceRef.current = true;
//       (async () => {
//         try {
//           await refreshAlarms();
//           console.log('알람 동기화 성공');
//         } catch (e) {
//           console.warn('초기 알람 동기화 실패(무시 가능):', e);
//         }
//       })();
//     }

//     // WakeUpAlarmPage로 이동
//     navigation.navigate('WakeUpAlarmPage');
//   }, [navigation, refreshAlarms]);

//   return <View />;
// }
