import HeroSection from '../components/home/top/HeroSection';
import TrendSection from '../components/home/trend/TrendSection';

import MyRankingSection from '../components/home/myrank/MyRankingSection';

import StreakCard from '../components/home/streak/StreakCard';

const HomePage = () => {
  return (
    <div className="mx-auto w-full max-w-260">
      <HeroSection />
      <div className="mt-12 flex flex-col gap-10 xl:flex-row xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <TrendSection />
          <MyRankingSection />
        </div>
        <div className="xl:w-95">
          <StreakCard />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
