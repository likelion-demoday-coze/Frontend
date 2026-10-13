import { useEffect, useState } from 'react';
import { getAttendanceToday } from '../api/attendance';
import { getFishBalance } from '../api/fish';
import { getTimeAttackToday } from '../api/timeAttack';

export interface QuizAttempt {
  used: number;
  limit: number;
}

export interface QuizEntryStatus {
  fishBalance: number;
  isPass: boolean;
  dailyAttempt: QuizAttempt;
  timeAttackAttempt: QuizAttempt;
}

//문제풀이 입장에 필요한 생선 잔액, 패스 여부, 오늘 횟수
const useQuizEntryStatus = () => {
  const [status, setStatus] = useState<QuizEntryStatus | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.all([getFishBalance(), getAttendanceToday(), getTimeAttackToday()])
      .then(([fishBalance, attendance, timeAttack]) => {
        if (ignore) return;
        const isPass = attendance.status === 'PASS_ACTIVE';
        setStatus({
          fishBalance,
          isPass,
          //TODO: 정규장 오늘 주가 반영 횟수 API 나오면 교체 (지금은 0회 사용으로 고정)
          dailyAttempt: { used: 0, limit: isPass ? 3 : 2 },
          timeAttackAttempt: {
            used: timeAttack.usedAttemptCount,
            limit: timeAttack.dailyAttemptLimit,
          },
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

  return { status, isError };
};

export default useQuizEntryStatus;
