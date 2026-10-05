import StatPill from './StatPill';

interface MyRankPanelProps {
  title?: string;
  criteria: string; //누적 주가 기준
  rank: number;
  lastRank: number; // 꼴찌 순위
  stats: { label: string; value: string }[];
  actionLabel: string; // 버튼 문구 (탭마다 다름)
  onAction?: () => void;
}

const MyRankPanel = ({
  title = '나의 랭킹 분석',
  criteria,
  rank,
  lastRank,
  stats,
  actionLabel,
  onAction,
}: MyRankPanelProps) => {
  const percent =
    lastRank > 1 ? ((lastRank - rank) / (lastRank - 1)) * 100 : 100;

  return (
    <aside className="h-fit w-full shrink-0 rounded-2xl border border-blue-15 p-5 lg:w-87">
      <h2 className="text-[20px] font-bold">{title}</h2>
      <p className="mt-1 text-xs text-gray-60">{criteria}</p>

      <p className="mt-14 text-center text-[24px] text-blue-60">
        {rank}
        <span className="pl-1.5 text-[14px] text-gray-60">위</span>
      </p>
      <div className="px-7">
        <div className="relative mt-4 h-px bg-gray-20">
          {/* 채워진 부분 */}
          <div
            className="absolute top-0 left-0 h-px bg-blue-60"
            style={{ width: `${percent}%` }}
          />

          {/* 끝점(1위) 동그라미 */}
          <span className="absolute top-1/2 right-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-20" />

          {/* 내 위치: 동그라미(바 위)와 라벨(바 아래)을 분리 */}
          <span
            className="absolute top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-60"
            style={{ left: `${percent}%` }}
          />
          <div
            className="absolute top-3 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${percent}%` }}
          >
            <span className="text-[10px] leading-none text-blue-60">▲</span>
            <span className="mt-1 text-[16px] font-bold whitespace-nowrap text-blue-60">
              내 순위
            </span>
          </div>
        </div>
      </div>
      <ul className="mt-24 flex flex-col gap-3">
        {stats.map((s) => (
          <StatPill key={s.label} {...s} />
        ))}
      </ul>

      <button
        type="button"
        onClick={onAction}
        disabled={!onAction}
        className="mx-auto mt-10 block w-42 cursor-pointer rounded-lg bg-blue-60 px-6 py-4 text-center text-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {actionLabel}
      </button>
    </aside>
  );
};

export default MyRankPanel;
