import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { mypass, PassHistories } from '../types/pass';

// 내 현재 패스 조회 (미보유 시 active: false, pass: null)
export const getCurrentPass = async () => {
  const { data } = await api.get<ApiResponse<mypass>>(
    '/api/v1/passes/me/current'
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 내 패스 이용 내역 조회 (페이지 번호는 0부터, size는 1~100)
export const getPassHistories = async (page = 0, size = 20) => {
  const { data } = await api.get<ApiResponse<PassHistories>>(
    '/api/v1/passes/me',
    { params: { page, size } }
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};
