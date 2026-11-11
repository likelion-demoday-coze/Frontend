//일주일 학습 상태 표시
import type { StreakDayData } from '../../../types/streak';
import StreakDay from './StreakDay';

interface StreakWeekProps {
  //월~일 순서의 데이터 7개
  days: StreakDayData[];
  variant?: 'default' | 'card';
}

const StreakWeek = ({ days, variant = 'default' }: StreakWeekProps) => {
  return (
    <ul
      aria-label="이번 주 학습 기록"
      className={`grid grid-cols-7 ${variant === 'card' ? 'gap-1' : 'gap-3'}`}
    >
      {days.map((day) => (
        <StreakDay key={day.id} day={day} variant={variant} />
      ))}
    </ul>
  );
};

export default StreakWeek;
