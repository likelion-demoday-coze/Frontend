export const formatPaymentDateTime = (value: string, includeYear = false) => {
  const zonedValue = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? value
    : `${value}+09:00`;
  const date = new Date(zonedValue);
  if (!Number.isFinite(date.getTime())) return '-';
  if (includeYear) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })
        .formatToParts(date)
        .map(({ type, value }) => [type, value])
    );
    return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
  }
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
};
