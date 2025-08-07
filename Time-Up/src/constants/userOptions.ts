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
