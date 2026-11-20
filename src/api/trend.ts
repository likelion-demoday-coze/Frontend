import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { TodayEconomicTrend, EconomicTrendDetail } from '../types/trend';

const DETAIL_CACHE_TTL = 30 * 60 * 1000;
const DETAIL_CACHE_LIMIT = 20;
const detailCache = new Map<
  number,
  { value: EconomicTrendDetail; expiresAt: number }
>();
const detailRequests = new Map<number, Promise<EconomicTrendDetail>>();

export const getTodayEconomicTrends = async () => {
  const { data } = await api.get<ApiResponse<TodayEconomicTrend>>(
    '/api/v1/economic-trends/today'
  );
  return data.result;
};

export const getEconomicTrendDetail = async (trendId: number) => {
  const now = Date.now();
  for (const [id, cached] of detailCache) {
    if (cached.expiresAt <= now) detailCache.delete(id);
  }
  const cached = detailCache.get(trendId);
  if (cached) return cached.value;

  // 같은 카드를 연속해서 열어도 진행 중인 요청은 공유
  const pending = detailRequests.get(trendId);
  if (pending) return pending;

  const request = api
    .get<ApiResponse<EconomicTrendDetail>>(`/api/v1/economic-trends/${trendId}`)
    .then(({ data }) => {
      const detail = data.result;
      // 모달에서 문자열·배열로 사용하는 필드를 캐시 저장 전에 확인
      if (
        !data.isSuccess ||
        !detail ||
        detail.trendId !== trendId ||
        typeof detail.contentDate !== 'string' ||
        (detail.summary != null && typeof detail.summary !== 'string') ||
        !Array.isArray(detail.terms) ||
        !detail.terms.every(
          (term) =>
            term !== null &&
            typeof term === 'object' &&
            typeof term.name === 'string' &&
            typeof term.description === 'string'
        ) ||
        !Array.isArray(detail.references) ||
        !detail.references.every(
          (reference) =>
            reference !== null &&
            typeof reference === 'object' &&
            typeof reference.url === 'string' &&
            typeof reference.publisher === 'string' &&
            typeof reference.title === 'string'
        )
      )
        throw new Error(
          data.message || '트렌드 상세 정보를 확인하지 못했어요.'
        );

      // 성공한 상세만 메모리에 보관하며 오래된 항목부터 제거
      if (detailCache.size >= DETAIL_CACHE_LIMIT) {
        const oldestId = detailCache.keys().next().value;
        if (oldestId !== undefined) detailCache.delete(oldestId);
      }
      detailCache.set(trendId, {
        value: detail,
        expiresAt: Date.now() + DETAIL_CACHE_TTL,
      });
      return detail;
    })
    .finally(() => {
      // 실패한 요청은 남기지 않아 기존 다시 시도 버튼으로 재조회 가능
      detailRequests.delete(trendId);
    });
  detailRequests.set(trendId, request);
  return request;
};
