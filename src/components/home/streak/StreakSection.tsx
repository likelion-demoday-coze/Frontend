import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { getMockStreak, STREAK_SCENARIOS } from '../../../mocks/streakMock';
import type { StreakView } from '../../../types/streak';
import StreakCard from './StreakCard';
import SectionTitle from '../../common/SectionTitle';

const StreakSection = () => {
  const navigate = useNavigate();

  // 현재 선택한 디자인 상태
  // 실제 API 연동 전이므로 화면 미리보기만 관리해.
  const [view, setView] = useState<StreakView>('learning');

  // 선택한 상태에서 계산할 수 있는 데이터이므로
  // 별도 state나 useEffect 없이 바로 생성해.
  const data = getMockStreak(view);

  return (
    <section className="w-full">
      <SectionTitle title="연속학습" />
      <StreakCard
        data={data}
        deadlineLabel={view === 'restorePending' ? '오늘 23:59' : undefined}
        onRestore={() => {
          alert('디자인 미리보기입니다. 복구 API는 아직 연결하지 않았어요.');
        }}
        onStartQuiz={() => {
          navigate(ROUTES.QUIZ);
        }}
      />
    </section>
  );
};

export default StreakSection;
