import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DailyQuizEndModal from '../../../components/quiz/DailyQuizEndModal';
import FeedbackBar from '../../../components/quiz/FeedbackBar';
import OptionButton from '../../../components/quiz/OptionButton';
import type { OptionStatus } from '../../../components/quiz/OptionButton';
import ProgressChip from '../../../components/quiz/ProgressChip';
import QuestionText from '../../../components/quiz/QuestionText';
import QuizLeaveModal from '../../../components/quiz/QuizLeaveModal';
import QuizCatPanel from '../../../components/quiz/QuizCatPanel';
import QuizHeader from '../../../components/quiz/QuizHeader';
import QuizProgressBar from '../../../components/quiz/QuizProgressBar';
import QuizStockPanel from '../../../components/quiz/QuizStockPanel';
import {
  completeSession,
  getSessionDetail,
  submitAnswer,
  submitRetryAnswer,
} from '../../../api/dailyQuiz';
import { getStockGraph } from '../../../api/stock';
import { getMyCharacter } from '../../../api/character';
import { getMyStreak, getStreakRecovery } from '../../../api/streak';
import StreakAchievementModal from '../../../components/home/streak/StreakAchievementModal';
import useAuthstore from '../../../stores/useAuthStore';
import {
  claimStreakAchievement,
  getStreakAchievement,
  readStreakAchievementStart,
  rememberStreakAchievementStart,
  rememberStreakAchievementEffects,
} from '../../../utils/streakAchievement';
import type { StreakAchievement } from '../../../utils/streakAchievement';
import { QUIZ_CATEGORY_INFO } from '../../../constants/quizCategory';
import { DAILY_FISH_COST } from '../../../constants/quizCost';
import { ROUTES, toDailyQuizReview } from '../../../constants/routes';
import useLeaveGuard from '../../../hooks/useLeaveGuard';
import type {
  OriginalAnswerResult,
  QuizSessionDetail,
  RetryAnswerResult,
} from '../../../types/quiz';

const formatTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const DailyQuizPlayPage = () => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);
  const navigate = useNavigate();
  const memberId = useAuthstore((state) => state.member?.memberId);
  const finishingRef = useRef(false);
  const activeRunRef = useRef({ active: true });
  const [achievement, setAchievement] = useState<StreakAchievement | null>(
    null
  );

  const [session, setSession] = useState<QuizSessionDetail | null>(null);
  const [isError, setIsError] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<
    OriginalAnswerResult | RetryAnswerResult | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockPoints, setStockPoints] = useState<number[]>([]);
  const [startSlot, setStartSlot] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [retryQueue, setRetryQueue] = useState<number[] | null>(null);
  const [retryPos, setRetryPos] = useState(0);
  const [learnedToday, setLearnedToday] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  //새로고침해도 아직 안 푼 문제부터 이어서 풀기
  useEffect(() => {
    let ignore = false;
    const run = { active: true };
    activeRunRef.current = run;
    finishingRef.current = false;
    const characterRequest = getMyCharacter({
      timeout: 5000,
      suppressNetworkAlert: true,
    }).catch(() => null);
    Promise.all([
      getSessionDetail(sessionId),
      getStockGraph('DAY').catch(() => null),
      getMyStreak().catch(() => null),
      getStreakRecovery().catch(() => undefined),
    ])
      .then(([detail, stock, streak, recovery]) => {
        if (ignore) return;
        if (memberId !== undefined && streak) {
          rememberStreakAchievementStart(memberId, sessionId, {
            date: streak.date,
            currentStreak: streak.currentStreak,
            learnedToday: streak.learnedToday,
            lastLearningDate: streak.lastLearningDate,
            effects: null,
            // 복구 상태를 확인하지 못했으면 일반 달성 팝업은 생략
            recoveryPending:
              recovery === undefined || recovery?.status === 'PENDING',
          });
          void characterRequest.then((character) => {
            if (ignore || finishingRef.current || !character) return;
            rememberStreakAchievementEffects(memberId, sessionId, character);
          });
        }
        setLearnedToday(!!streak?.learnedToday);
        setIsRecovering(recovery?.status === 'PENDING');
        if (detail.status === 'EXPIRED') {
          alert('오늘 정규장이 마감되어 더 풀 수 없어요.');
          navigate(ROUTES.QUIZ, { replace: true });
          return;
        }
        if (detail.status === 'COMPLETED') {
          navigate(toDailyQuizReview(sessionId), { replace: true });
          return;
        }
        const firstUnanswered = detail.questions.findIndex(
          (question) => !question.originalAnswered
        );
        const startIndex = Math.max(firstUnanswered, 0);
        setSession(detail);
        setResults(
          detail.questions.map((question) => question.originalCorrect)
        );
        //원본 5문제를 다 풀었으면 마감 팝업부터
        if (firstUnanswered === -1) {
          setIndex(detail.questions.length - 1);
          setIsEndOpen(true);
          return;
        }
        setIndex(startIndex);
        setStartSlot(startIndex);
        if (stock) setStockPoints([stock.currentStock]);
      })
      .catch((error) => {
        console.error('정규장 세션 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
      run.active = false;
    };
  }, [sessionId, navigate, memberId]);

  const leaveGuard = useLeaveGuard(!!session && !isEndOpen && !isCompleting);

  if (isError) {
    return (
      <p className="text-base text-gray-60">
        문제를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
    );
  }
  if (!session) {
    return <p className="text-base text-gray-60">불러오는 중...</p>;
  }

  const total = session.totalQuestionCount;
  const isLast = index === total - 1;
  const isRetry = retryQueue !== null;
  const currentIndex = isRetry ? retryQueue[retryPos] : index;
  const question = session.questions[currentIndex];

  const getOptionStatus = (optionId: number): OptionStatus => {
    if (result) {
      if (optionId === result.correctOptionId) return 'correct';
      if (optionId === result.selectedOptionId) return 'wrong';
      return 'default';
    }
    return optionId === selectedOptionId ? 'selected' : 'default';
  };

  const handleCheck = async () => {
    if (!selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isRetry) {
        const answer = await submitRetryAnswer(
          sessionId,
          question.sessionQuestionId,
          selectedOptionId
        );
        setResult(answer);
        return;
      }
      const answer = await submitAnswer(
        sessionId,
        question.sessionQuestionId,
        selectedOptionId
      );
      setResult(answer);
      setResults((prev) =>
        prev.map((isCorrect, i) => (i === index ? answer.correct : isCorrect))
      );
      setStockPoints((prev) =>
        prev.length > 0 ? [...prev, answer.currentStock] : prev
      );
    } catch (error) {
      console.error('정규장 답안 제출 실패', error);
      alert('답안을 제출하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAnswer = () => {
    setSelectedOptionId(null);
    setResult(null);
  };

  const handleNext = () => {
    if (isRetry) {
      if (retryPos === retryQueue.length - 1) {
        handleFinish();
        return;
      }
      setRetryPos((prev) => prev + 1);
      resetAnswer();
      return;
    }
    if (isLast) {
      setIsEndOpen(true);
      return;
    }
    setIndex((prev) => prev + 1);
    resetAnswer();
  };

  const handleFinish = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    const run = activeRunRef.current;
    setIsCompleting(true);
    try {
      await completeSession(sessionId);
    } catch (error) {
      if (!run.active) return;
      console.error('정규장 완료 처리 실패', error);
      alert('정산하지 못했어요. 잠시 후 다시 시도해 주세요.');
      finishingRef.current = false;
      setIsCompleting(false);
      return;
    }
    if (!run.active) return;

    // 완료 요청이 성공한 뒤의 조회 실패로 정산 요청을 반복하지 않음
    try {
      const before =
        memberId !== undefined
          ? readStreakAchievementStart(memberId, sessionId)
          : null;
      if (before && !before.recoveryPending) {
        const [streak, character, recovery] = await Promise.all([
          getMyStreak(),
          getMyCharacter({ timeout: 5000, suppressNetworkAlert: true }).catch(
            () => null
          ),
          getStreakRecovery(),
        ]);
        if (!run.active) return;
        // 오늘 복구한 건도 일반 달성 대신 기존 복구 완료 팝업으로 안내
        const yesterday = new Date(
          Date.parse(`${streak.date}T00:00:00Z`) - 24 * 60 * 60 * 1000
        )
          .toISOString()
          .slice(0, 10);
        const recoveryUsed =
          recovery?.status === 'PENDING' ||
          (recovery?.status === 'RECOVERED' &&
            recovery.missedDate === yesterday);
        const next = recoveryUsed
          ? null
          : getStreakAchievement(before, streak, character);
        if (
          next &&
          memberId !== undefined &&
          claimStreakAchievement(memberId, streak.date)
        ) {
          setIsEndOpen(false);
          setAchievement(next);
          return;
        }
      }
    } catch (error) {
      console.error('정규장 완료 후 연속학습 조회 실패', error);
    }
    if (run.active) navigate(toDailyQuizReview(sessionId));
  };

  //틀린 문제 중 아직 다시 풀지 않은 문제만 순서대로
  const handleRetry = () => {
    if (finishingRef.current) return;
    const queue = results
      .map((isCorrect, i) => (isCorrect ? -1 : i))
      .filter((i) => i >= 0 && !session.questions[i].retryAnswered);
    if (queue.length === 0) {
      handleFinish();
      return;
    }
    setRetryQueue(queue);
    setRetryPos(0);
    resetAnswer();
    setIsEndOpen(false);
  };

  //나가도 세션은 유지되고 오늘 안에 이어서 풀 수 있음
  const getLeaveCopy = () => {
    const answered = isRetry ? total : index + (result ? 1 : 0);
    const progressRow = {
      label: '진행',
      value: isRetry
        ? `오답 다시풀기 ${retryPos + (result ? 1 : 0)}/${retryQueue.length}`
        : `${answered}/${total}문제 · ${total - answered}문제 남았어요`,
      tone: 'blue' as const,
    };
    const deadline = `오늘 ${formatTime(session.expiresAt)}까지`;
    const fishRow = {
      label: 'FISH',
      value: session.passApplied
        ? '패스 이용 중 · 차감 없음'
        : `사용한 ${DAILY_FISH_COST}개는 반환 불가`,
    };

    if (isRecovering) {
      return {
        title: '복구가 아직 안 끝났어요',
        description:
          '나가도 진행 상황은 저장돼요.\n오늘 안에 끝까지 풀어야 연속 학습이 복구돼요.',
        rows: [
          progressRow,
          { label: '복구 마감', value: deadline, tone: 'red' as const },
          { label: '복구권', value: '반환 안 됨', tone: 'red' as const },
        ],
      };
    }
    return {
      title: '잠깐 쉬었다 올까요?',
      description: learnedToday
        ? `나가도 지금까지 푼 내용은 저장돼요.\n${deadline} 이어서 풀 수 있어요.`
        : '나가도 지금까지 푼 내용은 저장돼요.\n오늘 안에 이어서 끝내면 연속 학습이 인정돼요.',
      rows: [progressRow, { label: '이어 풀기', value: deadline }, fishRow],
    };
  };

  const catMood = !result ? 'idle' : result.correct ? 'correct' : 'wrong';
  const lastChange =
    result && 'stockIncreasePercent' in result
      ? result.stockIncreasePercent
      : null;
  const categoryLabel = QUIZ_CATEGORY_INFO[session.category].label;
  const progress = isRetry
    ? { current: retryPos + 1, total: retryQueue.length }
    : { current: index + 1, total };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:justify-center lg:gap-8">
        <div className="flex w-full flex-col gap-6 lg:w-153 lg:gap-12">
          <div className="flex flex-col gap-5 lg:gap-6">
            <QuizHeader
              mode="daily"
              subtitle={
                isRetry ? `${categoryLabel} · 오답 다시풀기` : categoryLabel
              }
              right={<ProgressChip {...progress} />}
            />
            <QuizProgressBar {...progress} />
          </div>

          <div className="flex flex-col gap-8 lg:gap-15 lg:px-5">
            <QuestionText>{question.content}</QuestionText>
            <div className="flex flex-col gap-3">
              {question.options.map((option) => (
                <OptionButton
                  key={option.optionId}
                  number={option.optionNumber}
                  label={option.content}
                  status={getOptionStatus(option.optionId)}
                  disabled={!!result || isSubmitting}
                  onClick={() => setSelectedOptionId(option.optionId)}
                />
              ))}
            </div>
          </div>

          {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
          {!result && (
            <button
              type="button"
              onClick={handleCheck}
              disabled={!selectedOptionId || isSubmitting}
              className="h-14 w-full cursor-pointer self-end rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 lg:h-16 lg:w-42"
            >
              CHECK
            </button>
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:mt-25">
          <QuizCatPanel mood={catMood} seed={currentIndex} />
          {!isRetry && stockPoints.length > 0 && (
            <QuizStockPanel
              points={stockPoints}
              slots={total - startSlot + 1}
              lastChange={lastChange}
            />
          )}
        </aside>
      </div>

      {leaveGuard.isLeaveOpen && (
        <QuizLeaveModal
          {...getLeaveCopy()}
          stayLabel="계속 풀기"
          onLeave={() => leaveGuard.confirmLeave()}
          onStay={leaveGuard.cancelLeave}
        />
      )}

      {isEndOpen && (
        <DailyQuizEndModal
          results={results}
          isLoading={isCompleting}
          onRetry={handleRetry}
          onNext={handleFinish}
          onClose={() => {}}
        />
      )}

      {result && !isCompleting && (
        <FeedbackBar
          isCorrect={result.correct}
          explanation={result.explanation}
          onNext={handleNext}
        />
      )}

      {achievement && (
        <StreakAchievementModal
          achievement={achievement}
          onClose={() => navigate(toDailyQuizReview(sessionId))}
        />
      )}
    </div>
  );
};

export default DailyQuizPlayPage;
