import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowIcon from '../../../assets/icons/arrow.svg?react';
import timeAttackTitle from '../../../assets/quiz/title_time_attack.svg';
import CountChip from '../../../components/quiz/CountChip';
import ReviewList from '../../../components/quiz/ReviewList';
import { getTimeAttackResult } from '../../../api/timeAttack';
import { toRanking } from '../../../constants/routes';
import type { TimeAttackResult } from '../../../types/timeAttack';

type ReviewTab = 'all' | 'wrong';

const PAGE_SIZE = 5;

const tabs: { value: ReviewTab; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'wrong', label: '오답만' },
];

const TimeAttackResultPage = () => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);
  const navigate = useNavigate();
  const [result, setResult] = useState<TimeAttackResult | null>(null);
  const [isError, setIsError] = useState(false);
  const [tab, setTab] = useState<ReviewTab>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let ignore = false;
    getTimeAttackResult(sessionId)
      .then((data) => {
        if (!ignore) setResult(data);
      })
      .catch((error) => {
        console.error('시간외거래 결과 조회 실패', error);
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

  const items = result.questions
    .map((question, index) => ({
      id: index,
      number: index + 1,
      content: question.content,
      correct: question.correct,
      correctOptionContent: question.correctOptionContent,
      explanation: question.explanation,
    }))
    .filter((item) => tab === 'all' || !item.correct);
  const visibleItems = isExpanded ? items : items.slice(0, PAGE_SIZE);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div className="flex flex-1 flex-col items-center bg-white px-4 py-8 lg:py-10">
      <div className="flex w-full max-w-251 flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-3">
              <img
                src={timeAttackTitle}
                alt="Time Attack"
                className="h-6 w-auto lg:h-7.75"
              />
              <span className="text-2xl leading-9 font-semibold text-black lg:text-[28px]">
                총정리
              </span>
            </h1>
            <p className="text-base font-medium break-keep text-gray-60 lg:text-lg">
              틀린 문제를 확인해 보세요. 문제를 누르면 해설이 펼쳐져요.
            </p>
          </div>
          <div className="flex gap-3 lg:gap-4">
            <CountChip type="combo" count={result.maxConsecutiveCorrectCount} />
            <CountChip type="correct" count={result.correctCount} />
            <CountChip type="wrong" count={result.incorrectCount} />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="총정리 보기"
          className="flex w-fit rounded-full bg-gray-05"
        >
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                setIsExpanded(false);
              }}
              className={`h-9 cursor-pointer rounded-full border px-5 text-sm font-semibold ${tab === value ? 'border-blue-60 bg-white text-blue-60' : 'border-transparent text-gray-60'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="py-10 text-center text-base text-gray-60">
            {tab === 'wrong' ? '틀린 문제가 없어요.' : '푼 문제가 없어요.'}
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <ReviewList key={tab} items={visibleItems} />
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-20 text-sm font-medium text-gray-60"
              >
                나머지 {hiddenCount}개 더보기
                <ArrowIcon aria-hidden="true" className="h-4 w-2 rotate-90" />
              </button>
            )}
          </div>
        )}
      </div>

      {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
      <button
        type="button"
        onClick={() => navigate(toRanking('afterhours'))}
        className="mt-auto h-14 w-full cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white lg:mt-12 lg:h-16 lg:w-42"
      >
        NEXT
      </button>
    </div>
  );
};

export default TimeAttackResultPage;
