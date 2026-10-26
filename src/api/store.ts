import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { MyItems, Storeitems, PurchaseItems } from '../types/store';

export const getStoreItems = async () => {
  const { data } = await api.get<ApiResponse<Storeitems[]>>(
    '/api/v1/store/items'
  );
  return data.result;
};

export const getOwnedItems = async () => {
  const { data } = await api.get<ApiResponse<MyItems[]>>(
    '/api/v1/members/me/items'
  );
  return data.result;
};

export const purchaseItem = async (
  itemId: number,
  quantity: number,
  requestId: string
) => {
  const { data } = await api.post<ApiResponse<PurchaseItems>>(
    `/api/v1/store/items/${itemId}/purchase`,
    { quantity, requestId }
  );
  return data.result;
};
