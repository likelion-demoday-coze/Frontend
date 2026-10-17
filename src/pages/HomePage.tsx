import { useState, useRef } from 'react';
import useAuthstore from '../stores/useAuthStore';
import { completeTutorial } from '../api/auth';

import TutorialModal from '../components/tutorial/TutorialModal';
import HeroSection from '../components/home/top/HeroSection';
import TrendSection from '../components/home/trend/TrendSection';

import MyRankingSection from '../components/home/myrank/MyRankingSection';

import StreakSection from '../components/home/streak/StreakSection';

const HomePage = () => {
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
      <HeroSection />
      <div className="mt-12 flex flex-col gap-10 xl:flex-row xl:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <TrendSection />
          <MyRankingSection />
        </div>
        <div className="xl:w-95">
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
