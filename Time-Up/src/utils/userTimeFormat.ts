export const formatTime = (time: { hour: string; minute: string } | null) => {
  if (!time || (time.hour === '00' && time.minute === '00')) {
    return '입력';
  }
  const hourText = time.hour !== '00' ? `${parseInt(time.hour)}시간` : '';
  const minuteText = time.minute !== '00' ? `${parseInt(time.minute)}분` : '';
  return `${hourText} ${minuteText}`.trim();
};

export const toYyyyMm = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  return `${year}-${month}`;
}
