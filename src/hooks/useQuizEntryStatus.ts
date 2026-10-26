import { useCallback, useEffect, useState } from 'react';
import { getAttendanceToday } from '../api/attendance';
import { getDailyQuizToday } from '../api/dailyQuiz';
import { getFishBalance } from '../api/fish';
import { getStreakRecovery } from '../api/streak';
import { getTimeAttackToday } from '../api/timeAttack';

export interface QuizAttempt {
  used: number;
  limit: number;
}

export interface QuizEntryStatus {
  fishBalance: number;
  isPass: boolean;
  canClaimAttendance: boolean;
  dailyAttempt: QuizAttempt;
  timeAttackAttempt: QuizAttempt;
  isRecovering: boolean;
}

//문제풀이 입장에 필요한 생선 잔액, 패스 여부, 오늘 횟수, 복구 진행 여부
const useQuizEntryStatus = () => {
  const [status, setStatus] = useState<QuizEntryStatus | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      getFishBalance(),
      getAttendanceToday(),
      getDailyQuizToday(),
      getTimeAttackToday(),
      getStreakRecovery().catch(() => null),
    ])
      .then(([fishBalance, attendance, dailyToday, timeAttack, recovery]) => {
        if (ignore) return;
        const isPass = attendance.status === 'PASS_ACTIVE';
        setStatus({
          fishBalance,
          isPass,
          canClaimAttendance: attendance.status === 'AVAILABLE',
          dailyAttempt: {
            used: dailyToday.usedStockReflectionCount,
            limit: dailyToday.stockReflectionLimit,
          },
          timeAttackAttempt: {
            used: timeAttack.usedAttemptCount,
            limit: timeAttack.dailyAttemptLimit,
          },
          isRecovering: recovery?.status === 'PENDING',
        });
      })
      .catch((error) => {
        console.error('문제풀이 입장 정보 조회 실패', error);
        if (!ignore) setIsError(true);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const applyAttendanceClaim = useCallback((fishBalance: number) => {
    setStatus(
      (prev) => prev && { ...prev, fishBalance, canClaimAttendance: false }
    );
  }, []);

  return { status, isError, applyAttendanceClaim };
};

export default useQuizEntryStatus;
