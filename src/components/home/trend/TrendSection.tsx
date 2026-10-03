import SectionTitle from '../../common/SectionTitle';
import TrendCard from './TrendCard';
import { MOCK_TRENDS } from '../../../mocks/trendMock';

const TrendSection = () => {
  return (
    <div>
      <SectionTitle
        title="오늘의 경제 트랜드"
        subtitle="라이너 API와 함께합니다."
      />
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
        {MOCK_TRENDS.map(({ id, ...item }) => (
          <TrendCard key={id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default TrendSection;
