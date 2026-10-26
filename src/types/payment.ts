export interface PaymentDetail {
  paymentId: number;
  orderNumber: string;
  productCode: string;
  productName: string;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt: string;
  completedAt: string;
  cancelledAt: string;
  failureMessage: string;
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
