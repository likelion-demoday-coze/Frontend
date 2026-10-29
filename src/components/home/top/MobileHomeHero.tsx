import PageTitleSection from '../../common/PageTitle';
import DailyRewardCard from './DailyRewardCard';

const MobileHomeHero = ({
  onBalanceChange,
}: {
  onBalanceChange: (balance: number) => void;
}) => (
  <section className="h-[402px] bg-blue-08 px-6 py-4 lg:hidden">
    <div className="mx-auto flex h-full w-full max-w-170 flex-col">
      <PageTitleSection
        title="지식 수익률을 높일 준비 되셨나요?"
        description="오늘의 정규장을 풀고 내 주가를 올려보세요"
        className="text-blue-60 [&_h1]:text-[clamp(18px,5vw,24px)] [&_h1]:whitespace-nowrap [&_p]:text-[clamp(12px,3.3vw,16px)] [&_p]:whitespace-nowrap"
      />
      <div className="mt-4 min-h-0 flex-1">
        <DailyRewardCard onBalanceChange={onBalanceChange} />
      </div>
    </div>
  </section>
);

export default MobileHomeHero;
