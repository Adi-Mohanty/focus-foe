export const formatTime = totalSeconds => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const minutesElapsed = (
  durationMinutes,
  secondsLeft
) => {
  const elapsed =
    durationMinutes * 60 - secondsLeft;

  return Math.max(
    0,
    Math.floor(elapsed / 60)
  );
};

export const getDayKey = () => {
  const days = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
  ];

  return days[new Date().getDay()];
};