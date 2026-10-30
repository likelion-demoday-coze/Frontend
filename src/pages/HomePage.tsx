import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import useAuthstore from '../stores/useAuthStore';
import { completeTutorial } from '../api/auth';
import { useBlockRankingReward } from '../hooks/useRankingRewardGate';

import TutorialModal from '../components/tutorial/TutorialModal';
import HeroSection from '../components/home/top/HeroSection';
import StockChartCard from '../components/home/top/StockChartCard';
import TrendSection from '../components/home/trend/TrendSection';

import MyRankingSection from '../components/home/myrank/MyRankingSection';

import StreakSection from '../components/home/streak/StreakSection';
import StreakRecoveryNotification from '../components/home/streak/StreakRecoveryNotification';

const HomePage = () => {
  const { isMobile, updateFishBalance } = useOutletContext<{
    isMobile: boolean;
    updateFishBalance: (balance: number) => void;
  }>();
  const member = useAuthstore((state) => state.member);
  const isInitialized = useAuthstore((state) => state.isInitialized);
  const [isTutorialDismissed, setIsTutorialDismissed] = useState(false);

  const completingRef = useRef(false);

  //임시
  /*const isTutorialOpen = !isTutorialDismissed;*/

  const isTutorialOpen =
    isInitialized &&
    member?.tutorialCompleted === false &&
    !isTutorialDismissed;

  useBlockRankingReward(isTutorialOpen);

  const closeTutorial = () => {
    setIsTutorialDismissed(true);
  };

  // 마지막 '시작하기' 버튼을 눌렀을 때 실행
  const handleTutorialComplete = async () => {
    if (completingRef.current) return;

    completingRef.current = true;

    try {
      const updatedMember = await completeTutorial();

      useAuthstore.getState().setMember(updatedMember);
    } catch {
      alert('튜토리얼 완료를 저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      completingRef.current = false;
    }
  };

  return (
    <div className="mx-auto w-full max-w-260">
      {isMobile ? (
        <StockChartCard />
      ) : (
        <HeroSection onBalanceChange={updateFishBalance} />
      )}
      {!isTutorialOpen && (
        <StreakRecoveryNotification />
      )}
      <div className="mt-12 flex flex-col gap-6 lg:flex-row">
        <div className="order-2 flex min-w-0 flex-col gap-10 lg:order-1 lg:flex-2 xl:flex-1">
          <TrendSection />
          <MyRankingSection />
        </div>
        <div className="order-1 min-w-0 lg:order-2 lg:flex-1 xl:w-90 xl:flex-none">
          <StreakSection />
        </div>
      </div>
      {isTutorialOpen && (
        <TutorialModal
          onClose={closeTutorial}
          onComplete={handleTutorialComplete}
        />
      )}
    </div>
  );
};

export default HomePage;
