import PageTitleSection from '../../common/PageTitle';
import DailyRewardCard from './DailyRewardCard';
import StockChartCard from './StockChartCard';

const HeroSection = () => {
  return (
    <section className="relative">
      {/* 하늘색 배경 반영 */}
      <div
        aria-hidden
        className="absolute -top-16 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-blue-08"
      />

      {/* 실제 내용 */}
      <div className="pb-10">
        <PageTitleSection
          title="지식 수익률을 높일 준비 되셨나요?"
          description="오늘의 정규장을 풀고 내 주가를 올려보세요"
          className="text-blue-60"
        />

        <div className="mt-9.5 flex flex-row gap-10">
          <div className="min-w-0 flex-2 xl:flex-1">
            <StockChartCard />
          </div>

          <div className="min-w-0 flex-1 xl:w-95 xl:flex-none xl:shrink-0">
            <DailyRewardCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
