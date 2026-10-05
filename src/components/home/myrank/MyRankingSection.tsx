import SectionTitle from '../../common/SectionTitle';
import MyRankSummaryCard from './MyRankSummaryCard';
import { useMyRankSummary } from '../../../hooks/rank/useMyRankSummary';

const MyRankingSection = () => {
  const { data, status } = useMyRankSummary();
  return (
    <div>
      <SectionTitle title="내 랭킹" linkTo="/ranking" linkLabel="전체보기" />
      <div className="mt-4 flex flex-col gap-6 xl:flex-row">
        {status === 'loading' && (
          <p className="text-sm text-gray-60">불러오는 중...</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-gray-60">랭킹을 불러오지 못했어요.</p>
        )}

        {/* 불러온 카드 (정규장 / 시간외거래, 내 기록이 있는 것만) */}
        {status === 'done' &&
          data?.map((rank) => (
            <div key={rank.title} className="min-w-0 flex-1">
              <MyRankSummaryCard {...rank} />
            </div>
          ))}

        {/* 둘 다 기록이 없을 때 */}
        {status === 'done' && data?.length === 0 && (
          <p className="text-sm text-gray-60">아직 랭킹 기록이 없어요.</p>
        )}
      </div>
    </div>
  );
};

export default MyRankingSection;
