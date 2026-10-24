import { useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { getMyStreak } from '../api/streak';
import type { MyStreak } from '../api/streak';

export const useMyStreak = () => {
  const [streak, setStreak] = useState<MyStreak | null>(null);
  const [isError, setIsError] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    let ignore = false;
    getMyStreak().then((result) => {
      if (!ignore) {
        setStreak(result);
        setIsError(false);
      }
    }).catch(() => {
      if (!ignore) {
        setStreak(null);
        setIsError(true);
      }
    });
    return () => { ignore = true; };
  }, [pathname]);

  return { streak, isError };
};

export const useStreakContext = () =>
  useOutletContext<ReturnType<typeof useMyStreak>>();
