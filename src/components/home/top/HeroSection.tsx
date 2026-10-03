import PageTitleSection from '../../common/PageTitle';
import DailyRewardCard from './DailyRewardCard';
import StockChartCard from './StockChartCard';
const HeroSection = () => {
  return (
    <div className="h-150">
      <div>
        <PageTitleSection
          title="지식 수익률을 높일 준비 되셨나요?"
          description="오늘의 정규장을 풀고 내 주가를 올려보세요"
          className="text-blue-60"
        />
      </div>
      <div className="mt-9.5 flex flex-col gap-10 lg:flex-row">
        <div className="flex-1">
          <StockChartCard />
        </div>

        {/* 오른쪽: 고정 폭 */}
        <div className="lg:w-95">
          <DailyRewardCard />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
