import api from './axiosInstance';
import type { ApiResponse } from '../types/api';

//내 생선 잔액 조회
export const getFishBalance = async () => {
  const { data } = await api.get<ApiResponse<{ balance: number }>>(
    '/api/v1/fish/me/balance'
  );
  return data.result.balance;
};
