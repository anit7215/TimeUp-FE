export const yearOptions = Array.from({ length: 101 }, (_, i) => {
  const currentYear = new Date().getFullYear();
  const y = currentYear - i;
  return { label: String(y), value: String(y) };
});

export const jobOptions = [
  { label: '직장인', value: 'worker' },
  { label: '공무원/군인', value: 'public_worker' },
  { label: '자영업자', value: 'self_employed' },
  { label: '프리랜서', value: 'freelancer' },
  { label: '학생', value: 'student' },
  { label: '무직', value: 'unemployed' },
  { label: '기타', value: 'other' },
];

export const transportOptions = [
  { label: '버스', value: 'bus' },
  { label: '지하철', value: 'subway' },
  { label: '자동차', value: 'car' },
  { label: '도보', value: 'walk' },
];

export const remindSoundOptions = [
  { label: '알림음 없음', value: 'no' },
  { label: 'Ring Tone', value: 'ring' },
  { label: 'Basic', value: 'vibrate' },
];

export const remindVibrationOptions = [
  { label: '진동 없음', value: 'no' },
  { label: 'Ring Tone', value: 'ring' },
  { label: 'Basic', value: 'vibrate' },
];

export const alarmSoundOptions = [
  { label: '알림음 없음', value: 'no' },
  { label: 'Heavy Raindrop', value: 'rain' },
];

export const vibrationTypeOptions = [
  { label: '진동없음', value: 'no' },
  { label: 'short1', value: 'short1' },
  { label: 'short2', value: 'short2' },
  { label: 'long1', value: 'long1' },
  { label: 'long2', value: 'long2' },
];

export const intervalOptions = [
  { label: '반복없음', value: '0' },
  { label: '5분', value: '5' },
  { label: '10분', value: '10' },
   { label: '15분', value: '15' },
  { label: '30분', value: '30' },
];

export const repeatCountOptions = [
  { label: '반복없음', value: '0' },
  { label: '3회', value: '3' },
  { label: '5회', value: '5' },
];