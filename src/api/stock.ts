import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { StockHistory, StockPeriod } from '../types/stock';

export const getStockGraph = async (period: StockPeriod) => {
  const { data } = await api.get<ApiResponse<StockHistory>>(
    '/api/v1/stocks/me/graph',
    { params: { period } }
  );
  return data.result;
};
