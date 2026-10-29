import { useEffect, useState } from 'react';
import textlogo from '../../assets/logos/coze_text_logo_black.svg';
import FeedbackBar from '../../components/quiz/FeedbackBar';
import OptionButton from '../../components/quiz/OptionButton';
import type { OptionStatus } from '../../components/quiz/OptionButton';
import ProgressChip from '../../components/quiz/ProgressChip';
import QuestionText from '../../components/quiz/QuestionText';
import QuizCatPanel from '../../components/quiz/QuizCatPanel';
import QuizProgressBar from '../../components/quiz/QuizProgressBar';
import QuizStockPanel from '../../components/quiz/QuizStockPanel';
import { startKaKaoLogin } from '../../api/auth';
import {
  getPreviewQuizzes,
  submitPreviewQuizAnswer,
} from '../../api/previewQuiz';
import type {
  PreviewQuizAnswerResult,
  PreviewQuizQuestion,
} from '../../types/previewQuiz';

const START_STOCK = 100;

//맛보기는 서버에 주가가 없어서 정답이면 5~10% 사이로 올림
const getRisePercent = () => Math.floor(Math.random() * 6) + 5;

const TryQuizPage = () => {
  const [questions, setQuestions] = useState<PreviewQuizQuestion[] | null>(
    null
  );
  const [isError, setIsError] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<PreviewQuizAnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockPoints, setStockPoints] = useState([START_STOCK]);
  const [lastChange, setLastChange] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let ignore = false;
    getPreviewQuizzes()
      .then((data) => {
        if (!ignore) setQuestions(data);
      })
      .catch((error) => {
        console.error('맛보기 문제 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const renderBody = () => {
    if (isError) {
      return (
        <p className="text-base text-gray-60">
          문제를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      );
    }
    if (!questions) {
      return <p className="text-base text-gray-60">불러오는 중...</p>;
    }
    if (isFinished) {
      //TODO: 맛보기 총정리 화면
      return null;
    }

    const total = questions.length;
    const question = questions[index];
    const progress = { current: index + 1, total };

    const getOptionStatus = (optionId: number): OptionStatus => {
      if (result) {
        if (optionId === result.correctOptionId) return 'correct';
        if (optionId === result.selectedOptionId) return 'wrong';
        return 'default';
      }
      return optionId === selectedOptionId ? 'selected' : 'default';
    };

    const catMood = !result ? 'idle' : result.correct ? 'correct' : 'wrong';

    return (
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
        <div className="flex w-full flex-col gap-6 lg:w-153 lg:gap-12">
          <div className="flex flex-col gap-5 lg:gap-6">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:gap-5">
                <h1 className="text-xl font-semibold text-black lg:text-[28px]">
                  맛보기 투자
                </h1>
                <span className="text-sm font-medium text-gray-60 lg:text-xl">
                  로그인 없이 세 문제만 풀어봐요
                </span>
              </div>
              <ProgressChip {...progress} />
            </header>
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
          <QuizCatPanel mood={catMood} seed={index} />
          <QuizStockPanel
            label="맛보기 주가"
            points={stockPoints}
            slots={total + 1}
            lastChange={lastChange}
          />
        </aside>
      </div>
    );
  };

  const handleCheck = async () => {
    if (!questions || !selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const answer = await submitPreviewQuizAnswer(
        questions[index].questionId,
        selectedOptionId
      );
      const rise = answer.correct ? getRisePercent() : 0;
      setResult(answer);
      setLastChange(rise);
      setStockPoints((prev) => {
        const current = prev[prev.length - 1];
        return [...prev, Math.round(current * (100 + rise)) / 100];
      });
    } catch (error) {
      console.error('맛보기 답안 제출 실패', error);
      alert('답안을 제출하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!questions) return;
    if (index === questions.length - 1) {
      setIsFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelectedOptionId(null);
    setResult(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-10 px-4 lg:h-16 lg:px-10">
        <img src={textlogo} alt="COZ:E" className="h-7 w-auto lg:h-8" />
        <button
          type="button"
          onClick={startKaKaoLogin}
          className="cursor-pointer text-sm font-medium text-blue-60 lg:text-lg"
        >
          건너뛰고 가입하기
        </button>
      </header>
      <main className="mx-auto w-full max-w-251.5 flex-1 px-4 pt-8 pb-10 lg:px-0 lg:pt-14">
        {renderBody()}
      </main>
      {result && !isFinished && (
        <FeedbackBar
          isCorrect={result.correct}
          explanation={result.explanation}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default TryQuizPage;
