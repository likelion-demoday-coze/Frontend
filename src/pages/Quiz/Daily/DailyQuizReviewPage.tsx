import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowIcon from '../../../assets/icons/arrow.svg?react';
import dailyQuizTitle from '../../../assets/quiz/title_daily_quiz.svg';
import AnswerMark from '../../../components/quiz/AnswerMark';
import CountChip from '../../../components/quiz/CountChip';
import { getSessionResult } from '../../../api/dailyQuiz';
import { toDailyQuizResult } from '../../../constants/routes';
import type { QuizResult } from '../../../types/quiz';

const DailyQuizReviewPage = () => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isError, setIsError] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

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
      <div className="flex w-full max-w-251 flex-col gap-8 lg:gap-12">
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

        <ul className="flex flex-col">
          {result.questions.map((question, index) => {
            const isOpen = openId === question.sessionQuestionId;
            const panelId = `review-${question.sessionQuestionId}`;
            return (
              <li
                key={question.sessionQuestionId}
                className={`rounded-[20px] border-t border-gray-20 ${isOpen ? 'border-b bg-gray-05' : 'bg-white'}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenId(isOpen ? null : question.sessionQuestionId)
                  }
                  className="flex w-full cursor-pointer items-start gap-3 px-2.5 py-5 text-left lg:items-center lg:gap-9"
                >
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="w-7 text-center text-base font-semibold text-blue-60">
                      {index + 1}
                    </span>
                    <AnswerMark isCorrect={question.correct} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-row lg:items-center lg:gap-9">
                    <span
                      className={`min-w-0 flex-1 text-base leading-6.5 font-semibold ${isOpen ? 'text-gray-80' : 'truncate text-gray-60'}`}
                    >
                      Q. {question.content}
                    </span>
                    <span className="flex shrink-0 items-center gap-4 lg:w-52">
                      <span className="shrink-0 text-sm font-medium text-gray-60">
                        정답
                      </span>
                      <span className="text-base font-semibold break-keep text-green-80">
                        {question.correctOptionContent}
                      </span>
                    </span>
                  </span>
                  <ArrowIcon
                    aria-hidden="true"
                    className={`h-4 w-2 shrink-0 self-center text-gray-40 ${isOpen ? '-rotate-90' : 'rotate-90'}`}
                  />
                </button>
                {isOpen && (
                  <div id={panelId} className="px-2.5 pb-5 lg:pl-26">
                    <p className="max-w-150 rounded-[20px] border border-gray-20 bg-white px-8 py-5 text-sm leading-5 font-medium break-keep text-gray-60">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
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
