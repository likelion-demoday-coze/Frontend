const pad = (value: number) => String(value).padStart(2, '0');

// 랭킹 기준일을 한국 시간의 어제와 비교하고, 나머지는 연도 없이 표시
export const formatRankingRewardDate = (
  rankingDate?: string,
  now = Date.now()
) => {
  if (!rankingDate) return '';
  const date = new Date(`${rankingDate}T00:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== rankingDate
  )
    return '';
  const dayMs = 24 * 60 * 60 * 1000;
  const kstOffset = 9 * 60 * 60 * 1000;
  const yesterday = new Date(now + kstOffset - dayMs)
    .toISOString()
    .slice(0, 10);
  return rankingDate === yesterday
    ? '어제'
    : `${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
};

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
