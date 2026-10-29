const pad = (value: number) => String(value).padStart(2, '0');

//10.24.
export const formatMonthDay = (dateTime: string) => {
  const date = new Date(dateTime);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}.`;
};

//14:23
export const formatTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

//10.24 14:23
export const formatMonthDayTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

//남은 시간: 하루 이상이면 일·시간, 한 시간 이상이면 시간·분, 그 아래는 분
export const formatRemaining = (until: string, now = Date.now()) => {
  const minutes = Math.max(
    Math.floor((new Date(until).getTime() - now) / 60_000),
    0
  );
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${minutes % 60}분`;
  return `${minutes}분`;
};
