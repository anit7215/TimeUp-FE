// src/apis/pushToken.ts
// import { axiosInstance } from '@/src/apis/axiosInstance';
// import { getAccessToken } from '@/src/utils/storage';

// export async function saveExpoPushToken(token: string) {
//   const accessToken = await getAccessToken();
//   // 백엔드 스펙에 맞게 URL/바디 키 이름을 바꿔주세요.
//   // 기상, 자동, 내, 일정, 피드백 알람 별 분기 처리?
//   // POST /alarm/{wakeup_alarm_id}/push  { expo_push_token: string }
//   // POST /alarm/{auto_alarm_id}/push
//   // POST /alarm/{alarm_id}/push
//   // POST /alarm/{schedule_id}/push
//   // POST /alarm/{alarm_id}/feedback/push
//   const res = await axiosInstance.post(
//     '/alarm/{wakeup_alarm_id}/push',
//     { expo_push_token: token },
//     { headers: { Authorization: `Bearer ${accessToken}` } }
//   );
//   return res.data;
// }
