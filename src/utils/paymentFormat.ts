export const formatPaymentDateTime = (value: string) => {
  const zonedValue = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? value
    : `${value}+09:00`;
  const date = new Date(zonedValue);
  if (!Number.isFinite(date.getTime())) return '-';
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
};
