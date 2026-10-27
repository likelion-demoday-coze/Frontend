import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

//퀴즈 도중 메뉴 이동·뒤로가기를 가로채서 확인 팝업을 띄우기 위한 훅
//BrowserRouter라 useBlocker 대신 링크 클릭과 popstate를 직접 막음
const useLeaveGuard = (enabled: boolean) => {
  const navigate = useNavigate();
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const isLeavingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element | null)?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank')
        return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      setPendingPath(url.pathname + url.search);
    };

    //뒤로가기를 한 번 받아낼 수 있게 같은 주소를 하나 더 쌓아 둠
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      if (isLeavingRef.current) return;
      window.history.pushState(null, '', window.location.href);
      setPendingPath(ROUTES.QUIZ);
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enabled]);

  const confirmLeave = (beforeLeave?: () => void) => {
    if (pendingPath === null) return;
    isLeavingRef.current = true;
    beforeLeave?.();
    navigate(pendingPath, { replace: true });
  };

  return {
    isLeaveOpen: enabled && pendingPath !== null,
    confirmLeave,
    cancelLeave: () => setPendingPath(null),
  };
};

export default useLeaveGuard;
