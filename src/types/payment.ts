export interface PaymentDetail {
  paymentId: number;
  orderNumber: string;
  productCode: string;
  productName: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  failureMessage: string | null;
}

export interface PaymentHistory {
  paymentId: number;
  orderNumber: string;
  productCode: string;
  productName: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt: string | null;
}

export interface PaymentHistories {
  payments: PaymentHistory[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface PaymentProduct {
  productId: number;
  productCode: string;
  productType: string;
  name: string;
  price: number;
  passDurationHours: number;
}

export interface CreatePaymentOrderRequest {
  productCode: string;
  receiverPhone: string;
}

export interface CreatePaymentOrderResult {
  paymentId: number;
  orderNumber: string;
  productCode: string;
  productName: string;
  amount: number;
  status: string;
  paymentUrl: string;
  requestedAt: string;
}

export interface CancelPaymentResult {
  paymentId: number;
  orderNumber: string;
  status: string;
  refundedAmount: number;
  refundedAt: string;
}
