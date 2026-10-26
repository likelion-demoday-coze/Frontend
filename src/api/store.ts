import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { MyItems, Storeitems, PurchaseItems } from '../types/store';

export const getStoreItems = async (period: Storeitems) => {
  const { data } = await api.get<ApiResponse<StockHistory>>(
    '/api/v1/store/items',
    { params: { period } }
  );
  return data.result;
};
