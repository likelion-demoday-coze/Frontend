import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import type { StreakData } from '../../../types/streak';
import { useStreakContext } from '../../../hooks/useMyStreak';
import StreakCard from './StreakCard';
import SectionTitle from '../../common/SectionTitle';

const EFFECT_STEPS = [
  { id: 'effect-3', requiredDays: 3, name: '동전' },
  { id: 'effect-7', requiredDays: 7, name: '은화' },
  { id: 'effect-14', requiredDays: 14, name: '금화' },
  { id: 'effect-21', requiredDays: 21, name: '시크릿' },
];

const StreakSection = () => {
  const navigate = useNavigate();
  const { streak, isError } = useStreakContext();
  const currentDays = streak?.currentStreak ?? 0;
  const nextStep = EFFECT_STEPS.find((step) => step.requiredDays > currentDays);
  const previousStep = [...EFFECT_STEPS].reverse().find(
    (step) => step.requiredDays <= currentDays
  );
  const data: StreakData = {
    view: streak?.learnedToday ? 'completed' : 'learning',
    currentDays,
    bestDays: null,
    days: [],
    effects: EFFECT_STEPS.map((step) => ({
      ...step,
      status: step.requiredDays <= currentDays
        ? 'active'
        : step.id === nextStep?.id ? 'upcoming' : 'locked',
    })),
    progress: {
      from: previousStep?.requiredDays ?? 0,
      to: nextStep?.requiredDays ?? 21,
      current: currentDays,
      nextName: nextStep?.name ?? '',
    },
    remainingDays: nextStep ? nextStep.requiredDays - currentDays : 0,
  };

  return (
    <section className="w-full">
      <SectionTitle title="연속학습" />
      {streak ? (
        <StreakCard
          data={data}
          showWeek={false}
          onRestore={() => {}}
          onStartQuiz={() => navigate(ROUTES.QUIZ)}
        />
      ) : (
        <p className="mt-4 text-sm text-gray-60">
          {isError ? '연속학습 정보를 불러오지 못했어요.' : '불러오는 중...'}
        </p>
      )}
    </section>
  );
};

export default StreakSection;
