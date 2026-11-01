import firstRank from '../../assets/ranking/1st_rank.svg';
import basic1 from '../../assets/character/basic_1.svg';
import timeAttack from '../../assets/ranking/timeattack.svg';
import bigBell from '../../assets/icons/big_bell.svg';

const STAT_ICONS: Record<string, string> = {
  상위: firstRank,
  '나의 누적 주가': basic1,
  '나의 최고 기록': basic1,
  '유저 평균 정답수': timeAttack,
  '유저 평균 주가': bigBell,
};

interface StatPillProps {
  label: string;
  value: string;
  compact?: boolean;
}

const StatPill = ({ label, value, compact = false }: StatPillProps) => (
  <li
    className={`flex h-14 items-center rounded-2xl border border-gray-20 py-2 ${compact ? 'gap-2 px-3' : 'gap-3 px-5'}`}
  >
    {STAT_ICONS[label] ? (
      <img
        src={STAT_ICONS[label]}
        alt=""
        className={`${compact ? 'size-8' : 'size-11'} shrink-0 object-contain`}
      />
    ) : (
      <div
        className={`${compact ? 'size-8' : 'size-11'} shrink-0 rounded-full bg-gray-20`}
      />
    )}
    <span
      className={`min-w-0 flex-1 font-semibold text-gray-60 ${compact ? 'text-sm' : 'text-[16px]'}`}
    >
      {label}
    </span>
    <span
      className={`text-blue-60 ${compact ? 'shrink-0 whitespace-nowrap text-sm' : ''}`}
    >
      {value}
    </span>
  </li>
);

export default StatPill;
