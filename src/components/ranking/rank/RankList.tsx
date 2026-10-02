import type { MyRank, RankItem } from '../../../types/ranking';
import RankRow from './RankRow';

interface RankListProps {
  me?: MyRank;
  items: RankItem[];
}

const RankList = ({ me, items }: RankListProps) => (
  <ul className="flex flex-col ">
    {me && <RankRow {...me} isMe />}
    {items.map((item) => (
      <RankRow key={item.rank} {...item} />
    ))}
  </ul>
);

export default RankList;
