export type FishTransactionType =
  | 'ATTENDANCE_REWARD'
  | 'RANKING_REWARD'
  | 'DAILY_QUIZ_COST'
  | 'TIME_ATTACK_COST'
  | 'ITEM_PURCHASE'
  | 'PAYMENT_CANCEL'
  | 'ADMIN_ADJUSTMENT';

export interface FishTransaction {
  transactionId: number;
  transactionType: FishTransactionType;
  amount: number; // 지급은 양수, 차감은 음수
  balanceAfter: number;
  referenceId: number | null;
  createdAt: string;
}

export interface FishTransactionPage {
  content: FishTransaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
