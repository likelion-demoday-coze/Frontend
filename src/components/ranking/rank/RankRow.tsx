import Avatar from './Avatar';
import ScoreBadge from './ScoreBadge';
import type { MyRank } from '../../../types/ranking';
import firstRank from '../../../assets/ranking/1st_rank.svg';
import secondRank from '../../../assets/ranking/2nd_rank.svg';
import thirdRank from '../../../assets/ranking/3rd_rank.svg';
import basic1 from '../../../assets/character/basic_1.svg';
import basic2 from '../../../assets/character/basic_2.svg';
import basic3 from '../../../assets/character/basic_3.svg';

const RANK_PROFILES: Record<number, string> = {
  1: basic3,
  2: basic2,
  3: basic1,
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
//큰 타입에서, 필요한 속성만을 골라서 새로운 타입을 만듦 -> Pick
const RankNumber = ({
  rank,
  isMe,
  change,
}: Pick<RankRowProps, 'rank' | 'isMe' | 'change'>) => {
  if (isMe) {
    return (
      <span className="flex items-center gap-1 text-blue-60 lg:gap-4.5">
        {RANK_IMAGES[rank] ? (
          <img
            src={RANK_IMAGES[rank]}
            alt={`${rank}위`}
            className="h-9 w-9 object-contain"
          />
        ) : (
          String(rank).padStart(3, '0')
        )}
        {!!change && (
          <span className="text-xs whitespace-nowrap">
            {change > 0 ? '▲' : '▼'} {Math.abs(change)}
          </span>
        )}
      </span>
    );
  }
  return RANK_IMAGES[rank] ? (
    <img
      src={RANK_IMAGES[rank]}
      alt={`${rank}위`}
      className="h-9 w-9 object-contain"
    />
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
      className={`flex h-14 items-center gap-2 rounded-[20px] px-3 cursor-pointer lg:gap-4 lg:rounded-2xl lg:px-5 ${
        isMe ? 'sticky top-0 z-10 border border-blue-60 bg-blue-08' : 'border-t border-gray-20'
      }`}
    >
      <div className="flex min-w-9 shrink-0 items-center lg:w-20">
        <RankNumber rank={rank} isMe={isMe} change={change} />
      </div>
      <div className="shrink-0">
        <Avatar src={RANK_PROFILES[rank] ?? basic1} />
      </div>
      <span
        title={nickname}
        className={`min-w-0 flex-1 truncate text-[16px] font-semibold ${isMe ? 'text-blue-60 lg:text-gray-60' : 'text-gray-60'}`}
      >
        {nickname}
      </span>
      <div className="shrink-0">
        <ScoreBadge value={score} isStock={isStock} isMe={isMe} />
      </div>
    </li>
  );
};

export default RankRow;
