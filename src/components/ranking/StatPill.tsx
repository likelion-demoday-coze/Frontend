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
}

const StatPill = ({ label, value }: StatPillProps) => (
  <li className="flex items-center rounded-2xl gap-3 border border-gray-20 px-5 py-2 h-14">
    {STAT_ICONS[label] ? (
      <img
        src={STAT_ICONS[label]}
        alt=""
        className="h-11 w-11 shrink-0 object-contain"
      />
    ) : (
      <div className="h-11 w-11 shrink-0 rounded-full bg-gray-20" />
    )}
    <span className="flex-1 font-semibold text-[16px] text-gray-60">
      {label}
    </span>
    <span className=" text-blue-60">{value}</span>
  </li>
);

export default StatPill;
