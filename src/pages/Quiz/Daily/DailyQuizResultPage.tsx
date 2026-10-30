import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bellIcon from '../../../assets/icons/big_bell.svg';
import CorrectIcon from '../../../assets/quiz/correct.svg?react';
import WrongIcon from '../../../assets/quiz/wrong.svg?react';
import DailyResultChart from '../../../components/quiz/DailyResultChart';
import { getSessionResult } from '../../../api/dailyQuiz';
import { ROUTES, toRanking } from '../../../constants/routes';
import type { QuizResult } from '../../../types/quiz';

const DailyQuizResultPage = () => {
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

  const isUp = result.totalProfit > 0;
  const lastIndex = result.questions.length - 1;

  return (
    <div className="flex flex-1 flex-col items-center gap-8 bg-white px-4 py-8 lg:gap-12 lg:py-10">
      <div className="flex w-full max-w-240 flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-1 lg:gap-2">
          <h1 className="text-xl font-semibold lg:text-[28px]">
            이번 정규장이 마감되었
            <span className="lg:hidden">어요</span>
            <span className="hidden lg:inline">습니다.</span>
          </h1>
          <p className="text-sm text-gray-60 lg:text-lg">
            이번 투자 결과를 확인해 보세요!
          </p>
        </div>

        <section className="flex flex-col gap-8 rounded-[20px] border border-gray-20 bg-white px-5 py-6 lg:gap-10 lg:px-18 lg:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-gray-50">
                오늘의 총 수익
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-[32px] font-normal text-blue-60 lg:text-[64px]">
                  {isUp ? '+' : ''}
                  {result.totalProfit.toFixed(2)}
                </strong>
                <img src={bellIcon} alt="" className="size-10 lg:size-20" />
                <span
                  className={`rounded-sm p-1.5 text-sm font-bold lg:p-2 lg:text-base ${isUp ? 'bg-red-05 text-red-55' : 'bg-gray-05 text-gray-60'}`}
                >
                  {isUp
                    ? `▲ ${result.totalReturnPercent.toFixed(2)}%`
                    : '변동 없음'}
                </span>
              </div>
            </div>
            <dl className="hidden items-center justify-between gap-10 rounded-[20px] border border-gray-20 px-7 py-6 lg:flex lg:w-90">
              <div className="flex flex-col items-center gap-1.5">
                <dt className="text-sm text-gray-40">시작 주가</dt>
                <dd className="text-xl font-medium text-black">
                  {result.startStock.toFixed(2)}
                </dd>
              </div>
              <span aria-hidden="true" className="h-px flex-1 bg-gray-20" />
              <div className="flex flex-col items-center gap-1.5">
                <dt className="text-sm text-gray-40">최종 주가</dt>
                <dd className="text-xl font-bold text-blue-50">
                  {result.endStock.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>

          <DailyResultChart
            startStock={result.startStock}
            correctCount={result.correctCount}
            points={result.questions.map((question) => ({
              stock: question.stockAfter,
              percent: question.stockIncreasePercent,
              correct: question.correct,
            }))}
          />

          <ol className="sr-only lg:not-sr-only lg:flex lg:justify-between lg:gap-4">
            <li className="flex flex-col items-center justify-center gap-5 rounded-xl bg-gray-05 px-4 py-4 lg:px-6">
              <span className="text-sm text-gray-40">시작 주가</span>
              <span className="text-lg font-medium text-black">
                {result.startStock.toFixed(2)}
              </span>
            </li>
            {result.questions.map((question, index) => (
              <li
                key={question.sessionQuestionId}
                className={`flex flex-col items-center justify-center gap-5 rounded-xl border bg-white px-4 py-4 lg:px-6 ${question.correct ? 'border-green-65' : 'border-red-55'}`}
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-gray-60">
                  Q{index + 1}
                  {question.correct ? (
                    <CorrectIcon
                      aria-label="정답"
                      className="size-3.5 text-green-65"
                    />
                  ) : (
                    <WrongIcon
                      aria-label="오답"
                      className="size-5 text-red-r"
                    />
                  )}
                </span>
                <span
                  className={`text-lg ${
                    index === lastIndex
                      ? 'font-semibold text-blue-60'
                      : question.correct
                        ? 'font-medium text-green-65'
                        : 'font-medium text-gray-60'
                  }`}
                >
                  {question.stockAfter.toFixed(2)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <dl className="flex items-center gap-6 self-center rounded-[20px] border border-gray-20 px-5 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-gray-40">시작 주가</dt>
            <dd className="text-lg font-medium text-black">
              {result.startStock.toFixed(2)}
            </dd>
          </div>
          <span aria-hidden="true" className="text-gray-20">
            →
          </span>
          <div className="flex flex-col items-end gap-1">
            <dt className="text-sm text-gray-40">최종 주가</dt>
            <dd className="text-lg font-bold text-blue-50">
              {result.endStock.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>

      {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
      <div className="flex w-full gap-3 lg:w-auto lg:gap-12">
        <button
          type="button"
          onClick={() => navigate(toRanking('regular'))}
          className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white text-lg font-semibold text-gray-40 lg:h-16 lg:w-42 lg:flex-none"
        >
          랭킹보기
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white lg:h-16 lg:w-42 lg:flex-none"
        >
          홈으로
        </button>
      </div>
    </div>
  );
};

export default DailyQuizResultPage;
