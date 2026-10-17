import incomtoday from '../../../assets/streak/incomplete_today.svg';
import comtoday from '../../../assets/streak/complete_today.svg';
import incom from '../../../assets/streak/incomplete.svg';
import com from '../../../assets/streak/complete.svg';
import restoreIcon from '../../../assets/streak/return.svg';
import unlearning from '../../../assets/streak/unlearning.svg';

import type { StreakDayData, StreakDayStatus } from '../../../types/streak';

interface StreakDayProps {
  // 부모가 전달한 요일과 학습 상태
  day: StreakDayData;
}

// 각 상태에 사용할 이미지와 접근성 설명
// Record를 사용해서 모든 StreakDayStatus에 이미지가 연결되도록 해.
const DAY_ICONS: Record<StreakDayStatus, { src: string; label: string }> = {
  completed: {
    src: com,
    label: '학습 완료',
  },
  incomplete: {
    src: incom,
    label: '학습 미완료',
  },
  todayCompleted: {
    src: comtoday,
    label: '오늘 학습 완료',
  },
  todayIncomplete: {
    src: incomtoday,
    label: '오늘 학습 미완료',
  },
  restored: {
    src: restoreIcon,
    label: '연속 학습 복구',
  },
  pending: {
    src: unlearning,
    label: '복구 필요 또는 복구 대기',
  },
};

const StreakDay = ({ day }: StreakDayProps) => {
  const icon = DAY_ICONS[day.status];

  return (
    <li className="flex min-w-0 flex-col items-center gap-1.5">
      <img
        src={icon.src}
        alt={`${day.label}요일: ${icon.label}`}
        className="size-7 shrink-0 object-contain"
      />

      <span className="text-[11px] text-gray-40">{day.label}</span>
    </li>
  );
};

export default StreakDay;
