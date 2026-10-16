import { useEffect, useState } from 'react';
import { getActiveSession } from '../api/dailyQuiz';
import type { ActiveQuizSession } from '../types/quiz';

//오늘 이어 풀 수 있는 정규장 세션 (없으면 null)
const useActiveDailySession = () => {
  const [activeSession, setActiveSession] = useState<ActiveQuizSession | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    getActiveSession()
      .then((session) => {
        if (!ignore) setActiveSession(session);
      })
      .catch((error) => console.error('진행 중인 정규장 조회 실패', error))
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { activeSession, isLoading };
};

export default useActiveDailySession;
