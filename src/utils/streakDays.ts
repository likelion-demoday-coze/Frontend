import type { MyStreak } from '../api/streak';
import type { StreakDayData, StreakDayStatus } from '../types/streak';

// 최근 복구 이벤트가 아닌 날짜별 서버 상태로 이번 주의 모든 복구 기록을 표시
export const toStreakDays = (days: MyStreak['days']): StreakDayData[] =>
  days.map((day) => {
    let status: StreakDayStatus;
    if (day.future) status = 'incomplete';
    else if (day.status === 'RECOVERY_COMPLETED') status = 'restored';
    else if (day.status === 'RECOVERY_PENDING') status = 'pending';
    else if (day.status === 'COMPLETED')
      status = day.today ? 'todayCompleted' : 'completed';
    else status = day.today ? 'todayIncomplete' : 'incomplete';

    return {
      id: day.date,
      label: ['일', '월', '화', '수', '목', '금', '토'][
        new Date(`${day.date}T00:00:00Z`).getUTCDay()
      ],
      status,
    };
  });
