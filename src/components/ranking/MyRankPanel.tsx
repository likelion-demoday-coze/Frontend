import StatPill from './StatPill';
import CrossIcon from '../../assets/signup/cross.svg?react';

export interface MyRankPanelProps {
  title?: string;
  titleId?: string;
  onClose?: () => void;
  criteria: string; //누적 주가 기준
  rank: number | null;
  lastRank: number; // 꼴찌 순위
  stats: { label: string; value: string; icon?: string }[];
  actionLabel: string; // 버튼 문구 (탭마다 다름)
  onAction?: () => void;
  emptyMessage?: string;
}

const MyRankPanel = ({
  title = '나의 랭킹 분석',
  titleId,
  onClose,
  criteria,
  rank,
  lastRank,
  stats,
  actionLabel,
  onAction,
  emptyMessage,
}: MyRankPanelProps) => {
  const percent =
    rank === null
      ? 0
      : lastRank > 1
        ? ((lastRank - rank) / (lastRank - 1)) * 100
        : 100;

  return (
    <aside className="relative h-fit w-full shrink-0 rounded-2xl border border-blue-15 p-5 lg:w-87">
      <h2
        id={titleId}
        className={`text-[20px] font-bold ${onClose ? 'pr-10' : ''}`}
      >
        {title}
      </h2>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="랭킹 분석 닫기"
          className="absolute top-5 right-5 grid size-7 cursor-pointer place-items-center rounded-full bg-gray-20"
        >
          <CrossIcon aria-hidden="true" className="size-4" />
        </button>
      )}
      <p className="mt-1 text-xs text-gray-60">{criteria}</p>

      <p className="mt-14 text-center text-[24px] text-blue-60">
        {rank ?? (emptyMessage ? null : '-')}
        {rank !== null && (
          <span className="pl-1.5 text-[14px] text-gray-60">위</span>
        )}
      </p>
      {rank === null && emptyMessage && (
        <p className="mt-2 text-center text-sm text-gray-60">{emptyMessage}</p>
      )}
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
          {rank !== null && (
            <>
              <span
                className="absolute top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-60"
                style={{ left: `${percent}%` }}
              />
              <div
                className="absolute top-3 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${percent}%` }}
              >
                <span className="text-[10px] leading-none text-blue-60">▲</span>
                <span className="mt-3 text-[16px] font-bold whitespace-nowrap text-blue-60">
                  내 순위
                </span>
              </div>
            </>
          )}
        </div>
        <div className="relative -top-9 -mx-4 mt-3 flex justify-between text-sm text-gray-60">
          <span>{lastRank > 0 ? `${lastRank}위` : '-'}</span>
          <span>1위</span>
        </div>
      </div>
      <ul className="mt-24 flex flex-col gap-3">
        {stats.map((s) => (
          <StatPill key={s.label} {...s} compact={Boolean(onClose)} />
        ))}
      </ul>

      <button
        type="button"
        onClick={onAction}
        disabled={!onAction}
        className={`mx-auto mt-10 block ${onClose ? 'w-full' : 'w-42'} cursor-pointer rounded-lg bg-blue-60 px-6 py-4 text-center text-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {actionLabel}
      </button>
    </aside>
  );
};

export default MyRankPanel;
