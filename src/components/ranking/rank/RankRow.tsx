import Avatar from './Avatar';
import ScoreBadge from './ScoreBadge';
import type { MyRank } from '../../../types/ranking';

interface RankRowProps extends MyRank {
  isMe?: boolean;
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
        {rank}
        {!!change && (
          <span className="text-xs">
            {change > 0 ? '▲' : '▼'} {Math.abs(change)}
          </span>
        )}
      </span>
    );
  }
  return rank <= 3 ? (
    <div className="h-9 w-9 rounded-lg bg-gray-20" />
  ) : (
    <span className="text-blue-60">{String(rank).padStart(3, '0')}</span>
  );
};

const RankRow = ({
  rank,
  nickname,
  score,
  profileImage,
  isMe,
  change,
}: RankRowProps) => {
  return (
    <li
      className={`flex h-14 items-center gap-4 rounded-2xl px-5 ${
        isMe ? 'border border-blue-60 bg-blue-08' : 'border-t border-gray-20'
      }`}
    >
      <div className="flex w-20 items-center">
        <RankNumber rank={rank} isMe={isMe} change={change} />
      </div>
      <Avatar src={profileImage} />
      <span className="flex-1 text-[16px] font-semibold text-gray-60">
        {nickname}
      </span>
      <ScoreBadge value={score} />
    </li>
  );
};

export default RankRow;
