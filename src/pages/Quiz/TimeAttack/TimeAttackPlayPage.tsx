import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CountChip from '../../../components/quiz/CountChip';
import OptionButton from '../../../components/quiz/OptionButton';
import type { OptionStatus } from '../../../components/quiz/OptionButton';
import QuestionText from '../../../components/quiz/QuestionText';
import QuizLeaveModal from '../../../components/quiz/QuizLeaveModal';
import QuizCatPanel from '../../../components/quiz/QuizCatPanel';
import QuizHeader from '../../../components/quiz/QuizHeader';
import QuizStockPanel from '../../../components/quiz/QuizStockPanel';
import TimeAttackEndModal from '../../../components/quiz/TimeAttackEndModal';
import { getStockGraph } from '../../../api/stock';
import {
  completeTimeAttackSession,
  getNextTimeAttackQuestion,
  getTimeAttackToday,
  submitTimeAttackAnswer,
} from '../../../api/timeAttack';
import { ROUTES, toTimeAttackResult } from '../../../constants/routes';
import useLeaveGuard from '../../../hooks/useLeaveGuard';
import type {
  TimeAttackAnswerResult,
  TimeAttackComplete,
  TimeAttackQuestion,
  TimeAttackToday,
} from '../../../types/timeAttack';

const TIME_LIMIT_MS = 60_000;
const FEEDBACK_DELAY_MS = 500;
const STOCK_POINT_COUNT = 6;

const formatTime = (ms: number) => {
  const seconds = Math.ceil(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

//나간 판은 뒤로가기로 다시 들어와도 이어서 풀 수 없게 기록
const leftKey = (sessionId: number) => `timeAttackLeft:${sessionId}`;

const hasLeftSession = (sessionId: number) => {
  try {
    return sessionStorage.getItem(leftKey(sessionId)) !== null;
  } catch {
    return false;
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const TimeAttackPlayPage = () => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);
  const navigate = useNavigate();

  const [current, setCurrent] = useState<TimeAttackQuestion | null>(null);
  const [isError, setIsError] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answer, setAnswer] = useState<TimeAttackAnswerResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [completeResult, setCompleteResult] =
    useState<TimeAttackComplete | null>(null);
  const [today, setToday] = useState<TimeAttackToday | null>(null);
  const [stockPoints, setStockPoints] = useState<number[]>([]);
  const isFinishingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    if (hasLeftSession(sessionId)) {
      navigate(ROUTES.QUIZ, { replace: true });
      return;
    }
    Promise.all([
      getNextTimeAttackQuestion(sessionId),
      getStockGraph('DAY').catch(() => null),
      getTimeAttackToday().catch(() => null),
    ])
      .then(([question, stock, todayStatus]) => {
        if (ignore) return;
        setToday(todayStatus);
        setCurrent(question);
        setEndsAt(new Date(question.endsAt).getTime());
        setCorrectCount(question.correctCount);
        setCombo(question.consecutiveCorrectCount);
        setMaxCombo(question.consecutiveCorrectCount);
        if (stock) {
          const recent = stock.points
            .slice(-STOCK_POINT_COUNT)
            .map((point) => point.stockValue);
          setStockPoints(recent.length > 0 ? recent : [stock.currentStock]);
        }
      })
      .catch((error) => {
        console.error('시간외거래 문제 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
    };
  }, [sessionId, navigate, loadCount]);

  const finish = useCallback(async () => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;
    try {
      const result = await completeTimeAttackSession(sessionId);
      if (isMountedRef.current) setCompleteResult(result);
    } catch (error) {
      console.error('시간외거래 완료 처리 실패', error);
    }
    if (isMountedRef.current) setIsFinished(true);
  }, [sessionId]);

  const remaining = endsAt === null ? TIME_LIMIT_MS : Math.max(endsAt - now, 0);
  const isTimeUp = endsAt !== null && remaining === 0;

  //타이머는 팝업이 떠 있어도 계속 흐름
  useEffect(() => {
    if (endsAt === null) return;
    const timer = setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (time >= endsAt) finish();
    }, 200);
    return () => clearInterval(timer);
  }, [endsAt, finish]);

  const handleSelect = useCallback(
    async (optionId: number) => {
      if (
        !current ||
        selectedOptionId !== null ||
        isTimeUp ||
        isFinishingRef.current
      )
        return;
      setSelectedOptionId(optionId);
      try {
        const [result] = await Promise.all([
          submitTimeAttackAnswer(
            sessionId,
            current.question.questionId,
            optionId
          ),
          wait(FEEDBACK_DELAY_MS),
        ]);
        if (!isMountedRef.current) return;
        setAnswer(result);
        setCorrectCount(result.correctCount);
        setCombo(result.consecutiveCorrectCount);
        setMaxCombo((prev) => Math.max(prev, result.consecutiveCorrectCount));
        if (!result.correct) setWrongCount((prev) => prev + 1);

        const [next] = await Promise.all([
          getNextTimeAttackQuestion(sessionId),
          wait(FEEDBACK_DELAY_MS),
        ]);
        if (!isMountedRef.current) return;
        setCurrent(next);
        setSelectedOptionId(null);
        setAnswer(null);
      } catch (error) {
        //제한 시간이 끝나 제출·출제가 막힌 경우 그대로 종료
        console.error('시간외거래 답안 제출 실패', error);
        finish();
      }
    },
    [current, selectedOptionId, isTimeUp, sessionId, finish]
  );

  const leaveGuard = useLeaveGuard(!!current && !isFinished);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        leaveGuard.isLeaveOpen ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      const option = current?.question.options.find(
        (item) => String(item.optionNumber) === event.key
      );
      if (option) handleSelect(option.optionId);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, handleSelect, leaveGuard.isLeaveOpen]);

  const handleLeave = () =>
    leaveGuard.confirmLeave(() => {
      try {
        sessionStorage.setItem(leftKey(sessionId), '1');
      } catch {
        //저장소를 못 쓰면 표시 없이 나감
      }
    });

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-base text-gray-60">
          문제를 불러오지 못했어요. 남은 시간 안에 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsError(false);
            setLoadCount((prev) => prev + 1);
          }}
          className="h-12 cursor-pointer rounded-xl bg-blue-60 px-6 text-base font-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }
  if (!current) {
    return <p className="text-base text-gray-60">불러오는 중...</p>;
  }

  const getOptionStatus = (optionId: number): OptionStatus => {
    if (answer) {
      if (optionId === answer.correctOptionId) return 'correct';
      if (optionId === answer.selectedOptionId) return 'wrong';
      return 'default';
    }
    return optionId === selectedOptionId ? 'selected' : 'default';
  };

  const elapsedPercent = ((TIME_LIMIT_MS - remaining) / TIME_LIMIT_MS) * 100;
  const catMood = !answer ? 'idle' : answer.correct ? 'correct' : 'wrong';

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:justify-center lg:gap-8">
      <div className="flex w-full flex-col gap-6 lg:w-153 lg:gap-12">
        <div className="flex flex-col gap-5 lg:gap-6">
          <QuizHeader
            mode="timeAttack"
            right={
              <>
                <CountChip type="combo" count={combo} />
                <CountChip type="correct" count={correctCount} />
              </>
            }
          />
          <div
            role="timer"
            aria-label={`남은 시간 ${formatTime(remaining)}`}
            className="relative h-8"
          >
            <span className="absolute top-1 left-0 h-px w-full bg-gray-20" />
            <span
              style={{ width: `${elapsedPercent}%` }}
              className="absolute top-1 left-0 h-px bg-red-r"
            />
            <span
              style={{ left: `${elapsedPercent}%` }}
              className="absolute top-1 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-r"
            />
            <span
              style={{ left: `${elapsedPercent}%` }}
              className="absolute top-3 -translate-x-1/2 text-base font-medium text-red-55"
            >
              {formatTime(remaining)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:gap-15 lg:px-5">
          <QuestionText>{current.question.content}</QuestionText>
          <div className="flex flex-col gap-3">
            {current.question.options.map((option) => (
              <OptionButton
                key={option.optionId}
                number={option.optionNumber}
                label={option.content}
                status={getOptionStatus(option.optionId)}
                disabled={selectedOptionId !== null || isTimeUp}
                onClick={() => handleSelect(option.optionId)}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-5 lg:mt-25">
        <QuizCatPanel mood={catMood} seed={correctCount} hideStockMessages />
        {stockPoints.length > 0 && (
          <div className="hidden lg:block">
            <QuizStockPanel
              points={stockPoints}
              muted
              notice="시간외거래는 주가에 반영되지 않아요"
            />
          </div>
        )}
      </aside>

      {leaveGuard.isLeaveOpen && (
        <QuizLeaveModal
          title="도전을 그만둘까요?"
          description={
            '지금 나가면 이번 도전은 기록되지 않아요.\n도전 횟수 1회는 이미 사용됐어요.'
          }
          rows={[
            { label: '남은 시간', value: formatTime(remaining), tone: 'blue' },
            { label: '지금까지', value: `${correctCount}문제 정답` },
            ...(today
              ? [
                  {
                    label: '도전 가능 횟수',
                    value: `${today.usedAttemptCount}회 사용됨 · 남은 ${today.remainingAttemptCount}회`,
                    tone: 'red' as const,
                  },
                ]
              : []),
          ]}
          stayLabel="계속 도전"
          onLeave={handleLeave}
          onStay={leaveGuard.cancelLeave}
        />
      )}

      {isFinished && (
        <TimeAttackEndModal
          maxCombo={completeResult?.maxConsecutiveCorrectCount ?? maxCombo}
          correctCount={completeResult?.correctCount ?? correctCount}
          incorrectCount={completeResult?.incorrectCount ?? wrongCount}
          onRetry={() => navigate(`${ROUTES.QUIZ}?mode=timeAttack&start=1`)}
          onNext={() => navigate(toTimeAttackResult(sessionId))}
        />
      )}
    </div>
  );
};

export default TimeAttackPlayPage;
