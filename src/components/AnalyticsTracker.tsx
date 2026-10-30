import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

const AnalyticsTracker = () => {
  const { pathname } = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    trackPageView(pathname);
    previousPath.current = pathname;
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
