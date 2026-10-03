import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../../../components/layouts/BackHeader';
import CategoryCard from '../../../components/quiz/CategoryCard';
import StartConfirmModal from '../../../components/quiz/StartConfirmModal';
import {
  QUIZ_CATEGORIES,
  QUIZ_CATEGORY_INFO,
} from '../../../constants/quizCategory';
import { DAILY_FISH_COST } from '../../../constants/quizCost';
import { ROUTES } from '../../../constants/routes';
import useQuizEntryStatus from '../../../hooks/useQuizEntryStatus';
import type { QuizCategory } from '../../../types/quiz';

const DailyCategoryPage = () => {
  const navigate = useNavigate();
  const { fishBalance, isPass, dailyAttempt } = useQuizEntryStatus();
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleNext = () => {
    if (!selectedCategory) return;
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = useCallback(() => setIsConfirmOpen(false), []);

  const handleStart = () => {
    //TODO: 세션 생성 API 연동 후 문제 풀이 화면으로 이동
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-05">
      <BackHeader title="카테고리 선택" backTo={ROUTES.QUIZ} />

      <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8 lg:gap-12.5 lg:py-12.5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h2 className="text-2xl leading-9 font-semibold break-keep text-black lg:text-[28px]">
            오늘 집중 공략할 카테고리를 선택해주세요
          </h2>
          <p className="text-base font-medium text-gray-60 lg:text-lg">
            8개 카테고리 중 오직 1개만 단일 선택할 수 있습니다.
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label="정규장 카테고리"
          className="grid w-full max-w-239.25 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-9"
        >
          {QUIZ_CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              label={QUIZ_CATEGORY_INFO[category].label}
              description={QUIZ_CATEGORY_INFO[category].description}
              selected={selectedCategory === category}
              onSelect={() => setSelectedCategory(category)}
            />
          ))}
        </div>

        {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedCategory}
          className="mt-auto h-14 w-full cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 lg:mt-12 lg:h-16 lg:w-42"
        >
          {selectedCategory ? '다음' : '카테고리 선택'}
        </button>
      </main>

      {isConfirmOpen && selectedCategory && (
        <StartConfirmModal
          categoryLabel={QUIZ_CATEGORY_INFO[selectedCategory].label}
          fishCost={DAILY_FISH_COST}
          fishBalance={fishBalance}
          isPass={isPass}
          attempt={dailyAttempt}
          onClose={handleCloseConfirm}
          onStart={handleStart}
          onCharge={() => navigate(ROUTES.SHOP)}
        />
      )}
    </div>
  );
};

export default DailyCategoryPage;
