import type { MyRank, RankItem } from '../../../types/ranking';
import RankRow from './RankRow';

interface RankListProps {
  me?: MyRank;
  items: RankItem[];
  isStock?: boolean;
}

const RankList = ({ me, items, isStock }: RankListProps) => (
  <ul className="flex flex-col ">
    {me && <RankRow {...me} isMe isStock={isStock} />}
    {items.map((item) => (
      <RankRow key={item.memberId ?? item.nickname} {...item} isStock={isStock} />
    ))}
  </ul>
);

export default RankList;
