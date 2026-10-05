import { Card } from '../../common/Card';
import type { MyRankSummary } from '../../../types/myRank';

const MyRankSummaryCard = ({
  title,
  rank,
  change,
  footnote,
  stats,
}: MyRankSummary) => {
  return (
    <Card className="flex gap-5 bg-white p-5">
      <div className="flex shrink-0 flex-col gap-8.5">
        <h3 className="text-[14px] text-gray-60 font-semibold">{title}</h3>
        <div className="flex gap-4.5">
          <span className="flex items-center text-[24px] text-blue-60">
            {rank}
            <span className="px-2 text-[14px] text-gray-60">위</span>
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
        {/* 안내문이 있을 때만 줄을 그림 */}
        {footnote && <p className="text-[12px] text-gray-60">{footnote}</p>}
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-4">
        {stats.map(({ label, value }) => (
          <li
            key={label}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-gray-05 px-3"
          >
            <span className="text-[12px] text-gray-60">{label}</span>
            <span className="text-[14px] font-semibold text-blue-60">
              {value}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default MyRankSummaryCard;
