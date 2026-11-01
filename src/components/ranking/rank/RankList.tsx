import type { MyRank, RankItem } from '../../../types/ranking';
import RankRow from './RankRow';

interface RankListProps {
  me?: MyRank;
  items: RankItem[];
  isStock?: boolean;
  onMeClick?: () => void;
}

const RankList = ({ me, items, isStock, onMeClick }: RankListProps) => (
  <ul className="flex flex-col ">
    {me && <RankRow {...me} isMe isStock={isStock} onClick={onMeClick} />}
    {items.map((item) => (
      <RankRow
        key={item.memberId ?? item.nickname}
        {...item}
        isStock={isStock}
      />
    ))}
  </ul>
);

export default RankList;
