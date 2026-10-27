import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DailyQuizEndModal from '../../../components/quiz/DailyQuizEndModal';
import FeedbackBar from '../../../components/quiz/FeedbackBar';
import OptionButton from '../../../components/quiz/OptionButton';
import type { OptionStatus } from '../../../components/quiz/OptionButton';
import ProgressChip from '../../../components/quiz/ProgressChip';
import QuestionText from '../../../components/quiz/QuestionText';
import QuizCatPanel from '../../../components/quiz/QuizCatPanel';
import QuizHeader from '../../../components/quiz/QuizHeader';
import QuizProgressBar from '../../../components/quiz/QuizProgressBar';
import QuizStockPanel from '../../../components/quiz/QuizStockPanel';
import {
  completeSession,
  getSessionDetail,
  submitAnswer,
} from '../../../api/dailyQuiz';
import { getStockGraph } from '../../../api/stock';
import { QUIZ_CATEGORY_INFO } from '../../../constants/quizCategory';
import { ROUTES, toDailyQuizReview } from '../../../constants/routes';
import type {
  OriginalAnswerResult,
  QuizSessionDetail,
} from '../../../types/quiz';

const DailyQuizPlayPage = () => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);
  const navigate = useNavigate();

  const [session, setSession] = useState<QuizSessionDetail | null>(null);
  const [isError, setIsError] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<OriginalAnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockPoints, setStockPoints] = useState<number[]>([]);
  const [startSlot, setStartSlot] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  //새로고침해도 아직 안 푼 문제부터 이어서 풀기
  useEffect(() => {
    let ignore = false;
    Promise.all([
      getSessionDetail(sessionId),
      getStockGraph('DAY').catch(() => null),
    ])
      .then(([detail, stock]) => {
        if (ignore) return;
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
    };
  }, [sessionId, navigate]);

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

  const question = session.questions[index];
  const total = session.totalQuestionCount;
  const isLast = index === total - 1;

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

  const handleNext = () => {
    if (isLast) {
      setIsEndOpen(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setResult(null);
  };

  const handleFinish = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      await completeSession(sessionId);
      navigate(toDailyQuizReview(sessionId));
    } catch (error) {
      console.error('정규장 완료 처리 실패', error);
      alert('정산하지 못했어요. 잠시 후 다시 시도해 주세요.');
      setIsCompleting(false);
    }
  };

  const handleRetry = () => {
    //TODO: 오답 다시풀기 연결
  };

  const catMood = !result ? 'idle' : result.correct ? 'correct' : 'wrong';
  const lastChange = result ? result.stockIncreasePercent : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
        <div className="flex w-full flex-col gap-6 lg:w-153 lg:gap-12">
          <div className="flex flex-col gap-5 lg:gap-6">
            <QuizHeader
              mode="daily"
              subtitle={QUIZ_CATEGORY_INFO[session.category].label}
              right={<ProgressChip current={index + 1} total={total} />}
            />
            <QuizProgressBar current={index + 1} total={total} />
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
          <QuizCatPanel mood={catMood} seed={index} />
          {stockPoints.length > 0 && (
            <QuizStockPanel
              points={stockPoints}
              slots={total - startSlot + 1}
              lastChange={lastChange}
            />
          )}
        </aside>
      </div>

      {isEndOpen && (
        <DailyQuizEndModal
          results={results}
          isLoading={isCompleting}
          onRetry={handleRetry}
          onNext={handleFinish}
          onClose={() => setIsEndOpen(false)}
        />
      )}

      {result && (
        <FeedbackBar
          isCorrect={result.correct}
          explanation={result.explanation}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default DailyQuizPlayPage;
