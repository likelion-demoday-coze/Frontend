import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { TodayEconomicTrend, EconomicTrendDetail } from '../types/trend';

export const getTodayEconomicTrends = async () => {
  const { data } = await api.get<ApiResponse<TodayEconomicTrend>>(
    '/api/v1/economic-trends/today'
  );
  return data.result;
};

export const getEconomicTrendDetail = async (trendId: number) => {
  const { data } = await api.get<ApiResponse<EconomicTrendDetail>>(
    `/api/v1/economic-trends/${trendId}`
  );
  return data.result;
};
