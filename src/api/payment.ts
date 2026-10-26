import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import type { PaymentDetail, PaymentHistories } from '../types/payment';

// 내 결제 내역 상세 조회
export const getPaymentDetail = async (paymentId: number) => {
  const { data } = await api.get<ApiResponse<PaymentDetail>>(
    `/api/v1/payments/${paymentId}`
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 주문번호로 내 결제 상태 조회
export const getPaymentStatus = async (orderNumber: string) => {
  const { data } = await api.get<ApiResponse<PaymentDetail>>(
    `/api/v1/payments/orders/${encodeURIComponent(orderNumber)}`
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 내 결제 내역 목록 조회 (페이지 번호는 0부터, size는 1~100)
export const getPaymentHistories = async (page = 0, size = 20) => {
  const { data } = await api.get<ApiResponse<PaymentHistories>>(
    '/api/v1/payments',
    { params: { page, size } }
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};
