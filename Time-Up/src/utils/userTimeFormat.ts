export const formatTime = (time: { hour: string; minute: string } | null) => {
  if (!time || (time.hour === '00' && time.minute === '00')) {
    return '입력';
  }
  const hourText = time.hour !== '00' ? `${parseInt(time.hour)}시간` : '';
  const minuteText = time.minute !== '00' ? `${parseInt(time.minute)}분` : '';
  return `${hourText} ${minuteText}`.trim();
};
