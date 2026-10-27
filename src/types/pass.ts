export interface mypass {
  active: boolean;
  pass: {
    memberPassId: number;
    passType: string;
    status: string;
    startedAt: string;
    expiresAt: string;
    cancelledAt: string | null;
  } | null;
}

export interface PassHistory {
  memberPassId: number;
  paymentId: number;
  orderNumber: string;
  passType: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  cancelledAt: string | null;
}

export interface PassHistories {
  passes: PassHistory[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
