import api from './axiosInstance';
import type { ApiResponse } from '../types/api';

export interface StreakRecovery {
  eventId: number;
  missedDate: string;
  status: 'AVAILABLE' | 'PENDING' | 'RECOVERED' | 'EXPIRED';
  requestable: boolean;
  method: 'ITEM' | 'PASS' | null;
  expiresAt: string | null;
}

//연속 학습 복구 상태 조회 (하락 기록 없으면 null)
export const getStreakRecovery = async () => {
  const { data } = await api.get<ApiResponse<StreakRecovery | null>>(
    '/api/v1/streaks/recovery'
  );
  return data.result;
};
