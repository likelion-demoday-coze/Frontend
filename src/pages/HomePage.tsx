import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useAuthstore from '../stores/useAuthStore';
import {
  acknowledgeSignupRewardPopup,
  completeTutorial,
  getMe,
} from '../api/auth';
import { ROUTES } from '../constants/routes';
import { useBlockRankingReward } from '../hooks/useRankingRewardGate';

import TutorialModal from '../components/tutorial/TutorialModal';
import HeroSection from '../components/home/top/HeroSection';
import StockChartCard from '../components/home/top/StockChartCard';
import TrendSection from '../components/home/trend/TrendSection';

import MyRankingSection from '../components/home/myrank/MyRankingSection';

import StreakSection from '../components/home/streak/StreakSection';
import StreakRecoveryNotification from '../components/home/streak/StreakRecoveryNotification';
import DailyRewardModal from '../components/home/top/DailyRewardModal';
import CharacterEvolutionNotification from '../components/home/top/CharacterEvolutionNotification';
import OpenChatNotification from '../components/home/top/OpenChatNotification';
import StreakRecoveryCompletion from '../components/home/streak/StreakRecoveryCompletion';

const HomePage = () => {
  const navigate = useNavigate();
  const { isMobile, updateFishBalance } = useOutletContext<{
    isMobile: boolean;
    updateFishBalance: (balance: number) => void;
  }>();
  const member = useAuthstore((state) => state.member);
  const isInitialized = useAuthstore((state) => state.isInitialized);
  const [isTutorialDismissed, setIsTutorialDismissed] = useState(false);
  const [openChatFinishedFor, setOpenChatFinishedFor] = useState<number | null>(
    null
  );
  const memberId = member?.memberId;
  const isOpenChatPending =
    isInitialized && memberId !== undefined && openChatFinishedFor !== memberId;
  const finishOpenChat = useCallback(() => {
    if (memberId !== undefined) setOpenChatFinishedFor(memberId);
  }, [memberId]);

  const completingRef = useRef(false);
  const acknowledgingRef = useRef(false);
  const active = useRef(true);
  const [isAcknowledgingReward, setIsAcknowledgingReward] = useState(false);
  const [rewardError, setRewardError] = useState('');

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  //임시
  /*const isTutorialOpen = !isTutorialDismissed;*/

  const isTutorialOpen =
    isInitialized &&
    member?.tutorialCompleted === false &&
    !isTutorialDismissed;

  const isSignupRewardOpen =
    isInitialized &&
    member?.tutorialCompleted === true &&
    member.signupRewardPopupPending === true;

  const popupBlocker = useBlockRankingReward(
    isOpenChatPending || isTutorialOpen || isSignupRewardOpen
  );

  const closeSignupReward = async (goToQuiz: boolean) => {
    if (!isSignupRewardOpen || acknowledgingRef.current || !member) return;
    const memberId = member.memberId;
    acknowledgingRef.current = true;
    setIsAcknowledgingReward(true);
    setRewardError('');
    try {
      const updatedMember = await acknowledgeSignupRewardPopup();
      if (useAuthstore.getState().member?.memberId !== memberId) return;
      if (
        updatedMember.memberId !== memberId ||
        updatedMember.signupRewardPopupPending !== false
      )
        throw new Error('보상 확인 상태가 해제되지 않았어요.');
      useAuthstore.getState().setMember(updatedMember);
      if (active.current && goToQuiz) navigate(ROUTES.QUIZ);
    } catch {
      if (
        active.current &&
        useAuthstore.getState().member?.memberId === memberId
      )
        setRewardError('보상 확인을 저장하지 못했어요. 다시 눌러 주세요.');
    } finally {
      acknowledgingRef.current = false;
      if (active.current) setIsAcknowledgingReward(false);
    }
  };

  const closeTutorial = () => {
    setIsTutorialDismissed(true);
  };

  // 마지막 '시작하기' 버튼을 눌렀을 때 실행
  const handleTutorialComplete = async () => {
    if (completingRef.current || !member) return;

    const memberId = member.memberId;
    completingRef.current = true;

    try {
      const updatedMember = await completeTutorial();
      // 튜토리얼 완료 뒤 /me의 최신 보상 미확인 여부로 표시 판단
      const latestMember = await getMe().catch(() => updatedMember);
      if (
        useAuthstore.getState().member?.memberId === memberId &&
        latestMember.memberId === memberId
      )
        useAuthstore.getState().setMember(latestMember);
    } catch {
      if (
        active.current &&
        useAuthstore.getState().member?.memberId === memberId
      )
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
      {!isOpenChatPending && !isTutorialOpen && !isSignupRewardOpen && (
        <>
          <StreakRecoveryCompletion />
          <StreakRecoveryNotification />
          <CharacterEvolutionNotification />
        </>
      )}
      {isInitialized &&
        memberId !== undefined &&
        !isTutorialOpen &&
        !isSignupRewardOpen && (
          <OpenChatNotification
            key={memberId}
            blocker={popupBlocker}
            onFinished={finishOpenChat}
          />
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
      {isSignupRewardOpen && (
        <DailyRewardModal
          variant="signup"
          amount={200}
          isSubmitting={isAcknowledgingReward}
          errorMessage={rewardError}
          onClose={() => {
            void closeSignupReward(false);
          }}
          onQuiz={() => {
            void closeSignupReward(true);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
