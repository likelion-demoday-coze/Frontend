import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../components/common/PageTitle';
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
    <div className="flex flex-1 flex-col items-center bg-white px-4 py-8 lg:py-10">
      <div className="flex w-full max-w-244 flex-col gap-8 lg:gap-20">
        <PageTitle
          title="오늘 집중 공략할 카테고리를 선택해주세요"
          description="8개 카테고리 중 오직 1개만 단일 선택할 수 있습니다."
        />

        <div
          role="radiogroup"
          aria-label="정규장 카테고리"
          className="mx-auto grid w-full grid-cols-2 gap-3 lg:w-fit lg:grid-cols-[repeat(4,13.25rem)] lg:gap-x-9 lg:gap-y-6.5"
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
      </div>

      {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedCategory}
        className="mt-auto h-14 w-full cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 lg:mt-17.5 lg:h-16 lg:w-42"
      >
        카테고리 선택
      </button>

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
