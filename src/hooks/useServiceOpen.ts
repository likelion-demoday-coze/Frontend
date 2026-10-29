import { useEffect, useState } from 'react';
import { OPEN_AT } from '../constants/launch';

const useServiceOpen = () => {
  const [isOpen, setIsOpen] = useState(() => Date.now() >= OPEN_AT);

  useEffect(() => {
    if (isOpen) return;
    const check = () => setIsOpen(Date.now() >= OPEN_AT);
    const checkVisible = () => {
      if (document.visibilityState === 'visible') check();
    };
    // 정해진 시각에 전환하고, 기기 시계 변경·절전·백그라운드 복귀도 재확인
    const deadline = window.setTimeout(
      check,
      Math.min(Math.max(0, OPEN_AT - Date.now()), 2147483647)
    );
    const timer = window.setInterval(check, 1000);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', checkVisible);

    return () => {
      window.clearTimeout(deadline);
      window.clearInterval(timer);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', checkVisible);
    };
  }, [isOpen]);

  return isOpen;
};

export default useServiceOpen;
