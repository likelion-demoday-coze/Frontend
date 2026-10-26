import api from './axiosInstance';
import type { ApiResponse } from '../types/api';

export interface MyStreak {
  date: string;
  currentStreak: number;
  learnedToday: boolean;
  lastLearningDate: string | null;
  highestStreak: number;
  weekStart: string;
  weekEnd: string;
  days: {
    date: string;
    status: string;
    today: boolean;
    future: boolean;
  }[];
}

export const getMyStreak = async () => {
  const { data } = await api.get<ApiResponse<MyStreak>>('/api/v1/streaks/me');
  console.log('스트릭 조회 결과:', data.result);
  return data.result;
};

export interface StreakRecovery {
  eventId: number;
  missedDate: string;
  status: 'AVAILABLE' | 'PENDING' | 'RECOVERED' | 'EXPIRED';
  requestable: boolean;
  method: 'ITEM' | 'PASS' | null;
  expiresAt: string | null;
}

// /api/v1/streaks/recoveries/{eventId} 응답
export interface StreakRecoveryDetail extends StreakRecovery {
  requestedAt: string | null;
  recoveredAt: string | null;
  quantityAfterRequest: number | null;
  stockAfterRecovery: number | null;
  streakAfterRecovery: number | null;
}

// 복구 상태 조회에서 받은 eventId로 복구 신청
export const requestStreakRecovery = async (eventId: number) => {
  const { data } = await api.post<ApiResponse<StreakRecoveryDetail>>(
    `/api/v1/streaks/recoveries/${eventId}`
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
};

//연속 학습 복구 상태 조회 (하락 기록 없으면 null)
export const getStreakRecovery = async () => {
  const { data } = await api.get<ApiResponse<StreakRecovery | null>>(
    '/api/v1/streaks/recovery'
  );
  return data.result;
};
