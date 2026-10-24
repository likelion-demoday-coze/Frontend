import Avatar from './Avatar';
import ScoreBadge from './ScoreBadge';
import type { MyRank } from '../../../types/ranking';
import firstRank from '../../../assets/ranking/1st_rank.svg';
import secondRank from '../../../assets/ranking/2nd_rank.svg';
import thirdRank from '../../../assets/ranking/3rd_rank.svg';
import basic1 from '../../../assets/character/basic_1.svg';
import basic2 from '../../../assets/character/basic_2.svg';
import basic3 from '../../../assets/character/basic_3.svg';
import basic4 from '../../../assets/character/basic_4.svg';

const RANK_PROFILES: Record<number, string> = {
  1: basic4,
  2: basic3,
  3: basic2,
};

const RANK_IMAGES: Record<number, string> = {
  1: firstRank,
  2: secondRank,
  3: thirdRank,
};

interface RankRowProps extends MyRank {
  isMe?: boolean;
  isStock?: boolean;
}
//큰 타입에서, 필요한 속성만을 골라서 새로운 타입을 만듦 ->Pick
const RankNumber = ({
  rank,
  isMe,
  change,
}: Pick<RankRowProps, 'rank' | 'isMe' | 'change'>) => {
  if (isMe) {
    return (
      <span className="flex items-center gap-4.5 text-blue-60">
        {RANK_IMAGES[rank] ? (
          <img src={RANK_IMAGES[rank]} alt={`${rank}위`} className="h-9 w-9 object-contain" />
        ) : rank}
        {!!change && (
          <span className="text-xs">
            {change > 0 ? '▲' : '▼'} {Math.abs(change)}
          </span>
        )}
      </span>
    );
  }
  return RANK_IMAGES[rank] ? (
    <img src={RANK_IMAGES[rank]} alt={`${rank}위`} className="h-9 w-9 object-contain" />
  ) : (
    <span className="text-blue-60">{String(rank).padStart(3, '0')}</span>
  );
};

const RankRow = ({
  isStock,
  rank,
  nickname,
  score,
  isMe,
  change,
}: RankRowProps) => {
  return (
    <li
      className={`flex h-14 items-center gap-4 rounded-2xl px-5 cursor-pointer ${
        isMe ? 'border border-blue-60 bg-blue-08' : 'border-t border-gray-20'
      }`}
    >
      <div className="flex w-20 items-center">
        <RankNumber rank={rank} isMe={isMe} change={change} />
      </div>
      <Avatar src={RANK_PROFILES[rank] ?? basic1} />
      <span className="flex-1 text-[16px] font-semibold text-gray-60">
        {nickname}
      </span>
      <ScoreBadge value={score} isStock={isStock} />
    </li>
  );
};

export default RankRow;
