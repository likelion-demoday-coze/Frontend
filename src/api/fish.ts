import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { FishTransactionPage } from '../types/fish';

//내 생선 잔액 조회
export const getFishBalance = async () => {
  const { data } = await api.get<ApiResponse<{ balance: number }>>(
    '/api/v1/fish/me/balance'
  );
  return data.result.balance;
};

//내 생선 증감 내역 조회 (최신순, 페이지 번호는 0부터)
export const getFishTransactions = async (page = 0, size = 6) => {
  const { data } = await api.get<ApiResponse<FishTransactionPage>>(
    '/api/v1/fish/me/transactions',
    { params: { page, size } }
  );
  return data.result;
};
