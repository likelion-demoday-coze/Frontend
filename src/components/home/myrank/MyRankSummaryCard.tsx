import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../common/Card';
import type { MyRankSummary } from '../../../types/myRank';

const formatRemainingTime = (seconds: number) =>
  [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

const MyRankSummaryCard = ({
  title,
  rank,
  change,
  footnote,
  stats,
  challengeTo,
  resetAt,
}: MyRankSummary) => {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (resetAt === undefined || !Number.isFinite(resetAt)) return;
    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= resetAt) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [resetAt]);

  const note =
    resetAt !== undefined && Number.isFinite(resetAt)
      ? `초기화까지 ${formatRemainingTime(Math.max(0, Math.ceil((resetAt - now) / 1000)))}`
      : footnote;

  return (
    <Card className="grid min-h-42.5 w-full grid-cols-[minmax(0,1fr)_108px] gap-x-3 gap-y-2 bg-white p-5">
      <div
        className={`flex min-w-0 flex-col justify-between gap-3 ${challengeTo ? '' : 'row-span-2'}`}
      >
        <h3 className="text-[16px] font-semibold break-keep text-gray-60">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-baseline gap-2 whitespace-nowrap text-[32px] leading-tight font-medium text-blue-60">
            {rank ?? '-'}
            <span className="text-[14px] font-normal text-gray-60">위</span>
          </span>
          {!!change && (
            <span className="flex items-center gap-1 text-sm font-semibold">
              <span className={change > 0 ? 'text-red-55' : 'text-blue-50'}>
                {change > 0 ? '▲' : '▼'}
              </span>
              {Math.abs(change)}
            </span>
          )}
        </div>
        {!challengeTo && note && (
          <p className="text-[12px] leading-relaxed tabular-nums text-gray-60">
            {note}
          </p>
        )}
      </div>
      {challengeTo ? (
        <Link
          to={challengeTo}
          className="flex min-h-13 items-center justify-center self-center rounded-2xl bg-blue-60 px-3 py-3 text-[16px] font-semibold whitespace-nowrap text-white"
        >
          도전하기
        </Link>
      ) : (
        <ul className="row-span-2 flex min-w-0 flex-col gap-3">
          {stats.map(({ label, value }) => (
            <li
              key={label}
              className="flex min-h-12 flex-1 items-center justify-center gap-1 rounded-2xl bg-gray-05 px-2"
            >
              <span className="shrink-0 text-[12px] text-gray-60">{label}</span>
              <span
                title={value}
                className="min-w-0 truncate text-[16px] font-semibold text-blue-60"
              >
                {value}
              </span>
            </li>
          ))}
        </ul>
      )}
      {challengeTo && note && (
        <p className="col-span-2 text-[12px] leading-relaxed text-gray-60">
          {note}
        </p>
      )}
    </Card>
  );
};

export default MyRankSummaryCard;
