import ReactGA from 'react-ga4';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const productionHosts = new Set(['coze.kids', 'www.coze.kids']);
let initialized = false;
let previousPageLocation = '';
let currentPageFields = { page_location: '', page_referrer: '' };

type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<
  string,
  AnalyticsValue | Record<string, AnalyticsValue>[]
>;

const canTrack = () =>
  Boolean(measurementId) &&
  import.meta.env.PROD &&
  productionHosts.has(window.location.hostname);

// 인증·결제 URL의 쿼리와 해시는 페이지 주소·유입 주소 모두에서 제외
const withoutQuery = (value: string) => {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
};

export const initializeAnalytics = () => {
  if (!canTrack() || initialized) return;

  previousPageLocation = withoutQuery(document.referrer);
  currentPageFields = {
    page_location: withoutQuery(window.location.href),
    page_referrer: previousPageLocation,
  };
  ReactGA.initialize(measurementId, {
    gtagOptions: {
      send_page_view: false,
      ...currentPageFields,
    },
  });
  initialized = true;
};

export const trackPageView = (path: string) => {
  if (!canTrack() || !initialized) return;

  const pageLocation = withoutQuery(path);
  const pagePath = new URL(pageLocation).pathname;
  const pageFields = {
    page_location: pageLocation,
    page_referrer: previousPageLocation,
  };
  currentPageFields = pageFields;
  ReactGA.set(pageFields);
  ReactGA.event('page_view', {
    ...pageFields,
    page_path: pagePath,
    page_title: document.title,
  });
  previousPageLocation = pageLocation;
};

export const trackEvent = (
  name: string,
  params?: AnalyticsParams
) => {
  if (!canTrack() || !initialized) return;

  ReactGA.event(name, {
    ...params,
    ...currentPageFields,
  });
};
