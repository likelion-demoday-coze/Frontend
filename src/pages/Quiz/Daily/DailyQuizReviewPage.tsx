import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dailyQuizTitle from '../../../assets/quiz/title_daily_quiz.svg';
import CountChip from '../../../components/quiz/CountChip';
import ReviewList from '../../../components/quiz/ReviewList';
import { getSessionResult } from '../../../api/dailyQuiz';
import { toDailyQuizResult } from '../../../constants/routes';
import type { QuizResult } from '../../../types/quiz';

const DailyQuizReviewPage = () => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let ignore = false;
    getSessionResult(sessionId)
      .then((data) => {
        if (!ignore) setResult(data);
      })
      .catch((error) => {
        console.error('정규장 결과 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
    };
  }, [sessionId]);

  if (!result) {
    return (
      <p className="px-4 py-8 text-base text-gray-60 lg:px-10">
        {isError
          ? '결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
          : '불러오는 중...'}
      </p>
    );
  }

  const total = result.questions.length;

  return (
    <div className="flex flex-1 flex-col items-center bg-white px-4 py-8 lg:py-10">
      <div className="flex w-full max-w-251 flex-col gap-8 pb-6 lg:gap-12 lg:pb-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-3">
              <img
                src={dailyQuizTitle}
                alt="Daily Quiz"
                className="h-6 w-auto lg:h-7.75"
              />
              <span className="text-2xl leading-9 font-semibold text-black lg:text-[28px]">
                총정리
              </span>
            </h1>
            <p className="text-base font-medium break-keep text-gray-60 lg:text-lg">
              {total}문제 중 {result.correctCount}문제를 맞혔어요. 틀린 문제의
              해설을 확인해 보세요.
            </p>
          </div>
          <div className="flex gap-3 lg:gap-6">
            <CountChip
              type="correct"
              count={result.correctCount}
              padded={false}
            />
            <CountChip
              type="wrong"
              count={result.incorrectCount}
              padded={false}
            />
          </div>
        </div>

        <ReviewList
          items={result.questions.map((question, index) => ({
            id: question.sessionQuestionId,
            number: index + 1,
            content: question.content,
            correct: question.correct,
            correctOptionContent: question.correctOptionContent,
            explanation: question.explanation,
          }))}
        />
      </div>

      {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
      <button
        type="button"
        onClick={() => navigate(toDailyQuizResult(sessionId))}
        className="mt-auto h-14 w-full cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white lg:mt-20 lg:h-16 lg:w-42"
      >
        NEXT
      </button>
    </div>
  );
};

export default DailyQuizReviewPage;
