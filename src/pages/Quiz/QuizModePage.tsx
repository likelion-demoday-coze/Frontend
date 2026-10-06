import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import ModeCard from '../../components/quiz/ModeCard';
import StartConfirmModal from '../../components/quiz/StartConfirmModal';
import { ROUTES, toRanking } from '../../constants/routes';
import {
  DAILY_FISH_COST,
  TIME_ATTACK_FISH_COST,
} from '../../constants/quizCost';
import useQuizEntryStatus from '../../hooks/useQuizEntryStatus';

type QuizMode = 'daily' | 'timeAttack';

const QuizModePage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [isTimeAttackConfirmOpen, setIsTimeAttackConfirmOpen] = useState(false);
  const { fishBalance, isPass, dailyAttempt, timeAttackAttempt } =
    useQuizEntryStatus();

  //정규장은 카테고리 선택으로, 시간외거래는 바로 시작 팝업
  const handleStart = () => {
    if (selectedMode === 'daily') navigate(ROUTES.DAILY_QUIZ);
    if (selectedMode === 'timeAttack') setIsTimeAttackConfirmOpen(true);
  };

  const handleCloseConfirm = useCallback(
    () => setIsTimeAttackConfirmOpen(false),
    []
  );

  const handleStartTimeAttack = () => {
    //TODO: 타임어택 세션 생성 API 연동 후 진행 화면으로 이동
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-16">
      <PageTitle
        title="어떤 모드로 투자하시겠어요?"
        description="원하는 매매 방식을 선택하여 지식 수익률을 극대화하세요."
      />

      <div className="flex flex-col items-center gap-10 lg:w-fit lg:gap-15">
        <div
          role="radiogroup"
          aria-label="문제풀이 모드"
          className="flex w-full flex-col gap-4 lg:flex-row lg:gap-5"
        >
          <ModeCard
            title="정규장"
            subtitle="매일 5문제 학습"
            description="8개 섹터 중 하나를 선택해 주가를 올려보세요."
            fishCost={DAILY_FISH_COST}
            fishBalance={fishBalance}
            isPass={isPass}
            attempt={dailyAttempt}
            exhaustedMessage={'오늘 주가 반영 횟수를\n모두 소진하셨습니다'}
            selected={selectedMode === 'daily'}
            onSelect={() => setSelectedMode('daily')}
          />
          <ModeCard
            title="시간외거래"
            subtitle="1분 타임어택 단타"
            description="빠른 순발력으로 랭킹을 뒤집으세요."
            fishCost={TIME_ATTACK_FISH_COST}
            fishBalance={fishBalance}
            isPass={isPass}
            attempt={timeAttackAttempt}
            exhaustedMessage={'오늘 학습 횟수를\n모두 소진하셨습니다'}
            selected={selectedMode === 'timeAttack'}
            onSelect={() => setSelectedMode('timeAttack')}
          />
        </div>

        {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
        <button
          type="button"
          onClick={handleStart}
          disabled={!selectedMode}
          className="h-14 w-full rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 lg:h-16 lg:w-42"
        >
          투자 시작하기
        </button>
      </div>

      {isTimeAttackConfirmOpen && (
        <StartConfirmModal
          mode="timeAttack"
          fishCost={TIME_ATTACK_FISH_COST}
          fishBalance={fishBalance}
          isPass={isPass}
          attempt={timeAttackAttempt}
          onClose={handleCloseConfirm}
          onStart={handleStartTimeAttack}
          onCharge={() => navigate(ROUTES.SHOP)}
          onRanking={() => navigate(toRanking('afterhours'))}
        />
      )}
    </div>
  );
};

export default QuizModePage;
