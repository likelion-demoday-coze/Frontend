import ReactGA from 'react-ga4';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const productionHosts = new Set(['coze.kids', 'www.coze.kids']);
let initialized = false;
let previousPageLocation = '';
let currentPageFields = { page_location: '', page_referrer: '' };
const sentEvents = new Set<string>();

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

export const trackEvent = (name: string, params?: AnalyticsParams) => {
  if (!canTrack() || !initialized) return false;

  try {
    ReactGA.event(name, {
      ...params,
      ...currentPageFields,
    });
    // true는 GA 명령 등록 여부이며, 서버 수신 완료를 의미하지 않음
    return true;
  } catch {
    // 분석 도구의 오류가 가입·보상·퀴즈·결제 처리를 중단하지 않도록 함
    return false;
  }
};

// 식별자는 브라우저의 중복 방지에만 사용하고 이벤트 매개변수에는 넣지 않음
export const trackEventOnce = (
  name: string,
  deduplicationId: string | number,
  params?: AnalyticsParams
) => {
  if (!canTrack() || !initialized) return;
  const key = `coze:analytics:${name}:${deduplicationId}`;
  if (sentEvents.has(key)) return;
  // 구매는 새로고침 후 재시도를 허용하고 GA4의 transaction_id로 중복 집계 방지
  if (name === 'purchase') {
    if (trackEvent(name, params)) sentEvents.add(key);
    return;
  }
  try {
    if (localStorage.getItem(key)) return;
  } catch {
    // 저장소가 차단되어도 현재 페이지 안에서는 중복 전송을 방지
  }
  if (!trackEvent(name, params)) return;
  sentEvents.add(key);
  try {
    localStorage.setItem(key, '1');
  } catch {
    // 저장소 오류는 서비스 동작에 영향을 주지 않음
  }
};
