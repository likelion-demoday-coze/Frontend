import { useCallback, useEffect, useState } from 'react';
import { getAttendanceToday } from '../api/attendance';
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
      getTimeAttackToday(),
      getStreakRecovery().catch(() => null),
    ])
      .then(([fishBalance, attendance, timeAttack, recovery]) => {
        if (ignore) return;
        const isPass = attendance.status === 'PASS_ACTIVE';
        setStatus({
          fishBalance,
          isPass,
          canClaimAttendance: attendance.status === 'AVAILABLE',
          //TODO: 정규장 오늘 주가 반영 횟수 API 나오면 교체 (지금은 0회 사용으로 고정)
          dailyAttempt: { used: 0, limit: isPass ? 3 : 2 },
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
