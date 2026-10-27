import api from './axiosInstance';
import type { ApiResponse } from '../types/api';
import { PAYMENT_ENABLED, PAYMENT_DISABLED_MESSAGE } from '../constants/payment';
import type {
  PaymentDetail,
  PaymentHistories,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResult,
  CancelPaymentResult,
} from '../types/payment';

// 결제 주문 생성 및 페이앱 결제 URL 발급
export const createPaymentOrder = async (payload: CreatePaymentOrderRequest) => {
  if (!PAYMENT_ENABLED) throw new Error(PAYMENT_DISABLED_MESSAGE);
  const { data } = await api.post<ApiResponse<CreatePaymentOrderResult>>(
    '/api/v1/payments/orders',
    payload
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 결제 전액 취소 (요청 본문 없음)
export const cancelPayment = async (paymentId: number) => {
  if (!PAYMENT_ENABLED) throw new Error(PAYMENT_DISABLED_MESSAGE);
  const { data } = await api.post<ApiResponse<CancelPaymentResult>>(
    `/api/v1/payments/${paymentId}/cancel`
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 내 결제 내역 상세 조회
export const getPaymentDetail = async (paymentId: number) => {
  const { data } = await api.get<ApiResponse<PaymentDetail>>(
    `/api/v1/payments/${paymentId}`
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

// 주문번호로 내 결제 상태 조회
export const getPaymentStatus = async (orderNumber: string, signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<PaymentDetail>>(
    `/api/v1/payments/orders/${encodeURIComponent(orderNumber)}`,
    { signal }
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
