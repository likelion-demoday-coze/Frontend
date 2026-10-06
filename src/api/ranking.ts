import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { TimeAttackRanking, StockRanking } from '../types/ranking';

//시간외거래
export const getTimeAttackRanking = async (page: number, size = 20) => {
  const { data } = await api.get<ApiResponse<TimeAttackRanking>>(
    '/api/v1/rankings/time-attacks',
    { params: { page, size } }
  );
  return data.result;
};

//정규장
export const getStockRanking = async (page: number, size = 20) => {
  const { data } = await api.get<ApiResponse<StockRanking>>(
    '/api/v1/rankings/stocks',
    { params: { page, size } }
  );
  return data.result;
};
