//일주일 학습 상태 표시
import type { StreakDayData } from '../../../types/streak';
import StreakDay from './StreakDay';

interface StreakWeekProps {
  //월~일 순서의 데이터 7개
  days: StreakDayData[];
}

const StreakWeek = ({ days }: StreakWeekProps) => {
  return (
    <ul
      aria-label="이번 주 학습 기록"

      className="grid grid-cols-7 gap-3"
    >
      {days.map((day) => (
        <StreakDay key={day.id} day={day} />
      ))}
    </ul>
  );
};

export default StreakWeek;
