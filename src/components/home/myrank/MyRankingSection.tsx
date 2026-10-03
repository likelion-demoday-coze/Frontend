import SectionTitle from '../../common/SectionTitle';
import MyRankSummaryCard from './MyRankSummaryCard';
import { MOCK_MY_RANKS } from '../../../mocks/myrankingMock';

const MyRankingSection = () => {
  return (
    <div>
      <SectionTitle title="내 랭킹" linkTo="/ranking" linkLabel="전체보기" />
      <div className="mt-4 flex flex-col gap-6 xl:flex-row">
        {MOCK_MY_RANKS.map((rank) => (
          <div key={rank.title} className="min-w-0 flex-1">
            <MyRankSummaryCard {...rank} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRankingSection;
