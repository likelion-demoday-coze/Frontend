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
      <span className="text-blue-60">
        {rank}
        {!!change && (
          //변동사항이 있다면 -> 절댓값사용
          <span className="text-xs text-gray-80">
            {change > 0 ? '▲' : '▼'} {Math.abs(change)}
          </span>
        )}
      </span>
    );
  }
  return rank <= 3 ? (
    <div className="h-9 w-9 rounded-lg bg-gray-20" />
  ) : (
    <span className="">{String(rank).padStart(3, '0')}</span>
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
      className={`flex items-center gap-4 px-4 py-2.5 ${
        isMe
          ? 'rounded-2xl border border-blue-60 bg-blue-08'
          : 'border-b border-gray-20'
      }`}
    >
      <div className="w-15.5">
        <RankNumber rank={rank} isMe={isMe} change={change} />
      </div>
      <Avatar src={profileImage} />
      <span className="flex-1 text-[16px] text-gray-60 font-semibold">
        {nickname}
      </span>
      <ScoreBadge value={score} />
    </li>
  );
};

export default RankRow;
