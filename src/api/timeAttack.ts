import api from './axiosInstance';
import type { ApiResponse } from '../types/api';

export interface TimeAttackToday {
  dailyAttemptLimit: number;
  usedAttemptCount: number;
  remainingAttemptCount: number;
}

//오늘의 시간외거래 참여 가능 횟수 조회
export const getTimeAttackToday = async () => {
  const { data } = await api.get<ApiResponse<TimeAttackToday>>(
    '/api/v1/time-attacks/today'
  );
  return data.result;
};
