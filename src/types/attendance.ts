export interface AttendanceReward {
  rewardDate: string;
  newlyClaimed: boolean;
  grantedAmount: number;
  balance: number;
}

export type AttendanceStatus = 'AVAILABLE' | 'CLAIMED' | 'PASS_ACTIVE';

export interface AttendanceToday {
  date: string; // 'YYYY-MM-DD' (KST)
  status: AttendanceStatus;
  rewardAmount: number; // 받을 수 있는 FISH 수
}
