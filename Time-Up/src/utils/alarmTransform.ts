// src/utils/alarmTransform.ts
import type { AlarmItem, PatchMyAlarmRequest, VibrationType } from '@/src/types/alarm';

/**
 * 화면용 AlarmItem → API 요청용 PatchMyAlarmRequest 변환
 */
export function toPatchMyAlarmRequest(alarm: AlarmItem): PatchMyAlarmRequest {
  const { title, time, isActive, sound, vibrate, repeat, memo } = alarm;

  const [intervalStr = '10분', countStr = '1회'] = repeat.split(',').map(str => str.trim());
  const repeat_interval = parseInt(intervalStr.replace('분', ''), 10);
  const repeat_count = parseInt(countStr.replace('회', ''), 10);

  return {
    my_alarm_name: title,
    my_alarm_time: `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`,
    is_active: isActive,
    is_repeating: repeat !== '',
    is_sound: sound !== '',
    is_vibrating: vibrate !== 'None',
    vibration_type: vibrate as VibrationType,
    sound_id: 1, // TODO: 실제 sound 이름 → ID 매핑 로직 필요
    repeat_interval,
    repeat_count,
    memo,
  };
}

/**
 * API 요청용 PatchMyAlarmRequest → 화면용 AlarmItem 변환
 * @param req API 요청에 사용된 데이터
 * @param id 알람 식별자
 */
export function toAlarmItem(req: PatchMyAlarmRequest, id: string): AlarmItem {
  const [hourStr, minuteStr] = req.my_alarm_time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour > 12 ? hour - 12 : hour;

  return {
    id,
    title: req.my_alarm_name,
    time: {
      period,
      hour: displayHour,
      minute,
    },
    date: {
      fullDate: '2025-07-30',    // TODO: 실제 날짜 주입 필요
      dayOfWeek: '수',           // TODO: 실제 요일 계산 필요
    },
    sound: 'Heavy Raindrop',     // TODO: 실제 sound_id → sound 이름 매핑 필요
    vibrate: req.vibration_type,
    repeat: `${req.repeat_interval}분, ${req.repeat_count}회`,
    memo: req.memo,
    isActive: req.is_active,
  };
}
