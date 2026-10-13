import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import ModeCard from '../../components/quiz/ModeCard';
import ResumeQuizModal from '../../components/quiz/ResumeQuizModal';
import StartConfirmModal from '../../components/quiz/StartConfirmModal';
import { ROUTES, toDailyQuizPlay } from '../../constants/routes';
import {
  DAILY_FISH_COST,
  TIME_ATTACK_FISH_COST,
} from '../../constants/quizCost';
import useActiveDailySession from '../../hooks/useActiveDailySession';
import useQuizEntryStatus from '../../hooks/useQuizEntryStatus';

type QuizMode = 'daily' | 'timeAttack';

const QuizModePage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [isTimeAttackConfirmOpen, setIsTimeAttackConfirmOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { status, isError } = useQuizEntryStatus();
  const { activeSession } = useActiveDailySession();

  const handleCloseConfirm = useCallback(
    () => setIsTimeAttackConfirmOpen(false),
    []
  );
  const handleCloseResume = useCallback(() => setIsResumeOpen(false), []);

  const title = (
    <PageTitle
      title="어떤 모드로 투자하시겠어요?"
      description="원하는 매매 방식을 선택하여 지식 수익률을 극대화하세요."
    />
  );

  if (!status) {
    return (
      <div className="flex flex-col gap-8 lg:gap-16">
        {title}
        <p className="text-base text-gray-60">
          {isError
            ? '정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
            : '불러오는 중...'}
        </p>
      </div>
    );
  }

  const { fishBalance, isPass, dailyAttempt, timeAttackAttempt } = status;
  const isResumable = selectedMode === 'daily' && !!activeSession;
  const fishCost =
    selectedMode === 'timeAttack' ? TIME_ATTACK_FISH_COST : DAILY_FISH_COST;
  const isFishShort =
    !!selectedMode && !isResumable && !isPass && fishBalance < fishCost;

  const goToShop = () => navigate(ROUTES.SHOP);

  //정규장은 이어 풀기 또는 카테고리 선택으로, 시간외거래는 바로 시작 팝업
  const handleStart = () => {
    if (isResumable) return setIsResumeOpen(true);
    if (isFishShort) return goToShop();
    if (selectedMode === 'daily') navigate(ROUTES.DAILY_QUIZ);
    if (selectedMode === 'timeAttack') setIsTimeAttackConfirmOpen(true);
  };

  const handleStartTimeAttack = () => {
    //TODO: 타임어택 세션 생성 API 연동 후 진행 화면으로 이동
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-16">
      {title}

      <div className="flex flex-col items-center gap-10 lg:w-fit lg:gap-15">
        <div
          role="radiogroup"
          aria-label="문제풀이 모드"
          className="flex w-full flex-col gap-4 lg:flex-row lg:gap-5"
        >
          <ModeCard
            mode="daily"
            fishCost={DAILY_FISH_COST}
            fishBalance={fishBalance}
            isPass={isPass}
            attempt={dailyAttempt}
            isInProgress={!!activeSession}
            selected={selectedMode === 'daily'}
            onSelect={() => setSelectedMode('daily')}
            onCharge={goToShop}
          />
          <ModeCard
            mode="timeAttack"
            fishCost={TIME_ATTACK_FISH_COST}
            fishBalance={fishBalance}
            isPass={isPass}
            attempt={timeAttackAttempt}
            selected={selectedMode === 'timeAttack'}
            onSelect={() => setSelectedMode('timeAttack')}
            onCharge={goToShop}
          />
        </div>

        {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
        <button
          type="button"
          onClick={handleStart}
          disabled={!selectedMode}
          className="h-14 w-full cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 lg:h-16 lg:w-42"
        >
          {isFishShort ? 'FISH 충전하기' : '투자 시작하기'}
        </button>
      </div>

      {isResumeOpen && activeSession && (
        <ResumeQuizModal
          session={activeSession}
          onClose={handleCloseResume}
          onResume={() => navigate(toDailyQuizPlay(activeSession.sessionId))}
        />
      )}

      {isTimeAttackConfirmOpen && (
        <StartConfirmModal
          mode="timeAttack"
          fishCost={TIME_ATTACK_FISH_COST}
          fishBalance={fishBalance}
          isPass={isPass}
          attempt={timeAttackAttempt}
          onClose={handleCloseConfirm}
          onStart={handleStartTimeAttack}
          onCharge={goToShop}
        />
      )}
    </div>
  );
};

export default QuizModePage;
