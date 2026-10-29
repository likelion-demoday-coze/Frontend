import api from './axiosInstance';
import type { AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/api';
import type {
  TimeAttackRanking,
  StockRanking,
  RankingReward,
} from '../types/ranking';

//시간외거래
export const getTimeAttackRanking = async (
  page: number,
  size = 20,
  options: Pick<AxiosRequestConfig, 'suppressNetworkAlert'> = {}
) => {
  const { data } = await api.get<ApiResponse<TimeAttackRanking>>(
    '/api/v1/rankings/time-attacks',
    { ...options, params: { page, size } }
  );
  return data.result;
};

//정규장
export const getStockRanking = async (
  page: number,
  size = 20,
  options: Pick<AxiosRequestConfig, 'suppressNetworkAlert'> = {}
) => {
  const { data } = await api.get<ApiResponse<StockRanking>>(
    '/api/v1/rankings/stocks',
    { ...options, params: { page, size } }
  );
  return data.result;
};

// 이미 지급된 보상 중 아직 확인하지 않은 목록
export const getUnreadRankingRewards = async () => {
  const { data } = await api.get<ApiResponse<{ rewards: RankingReward[] }>>(
    '/api/v1/rankings/rewards/unread'
  );
  if (!data.isSuccess) throw new Error(data.message);
  return data.result.rewards;
};

// 팝업을 확인한 보상만 읽음 처리 (생선 추가 지급 아님)
export const markRankingRewardRead = async (rankingRewardId: number) => {
  const { data } = await api.patch<ApiResponse<string>>(
    `/api/v1/rankings/rewards/${rankingRewardId}/read`
  );
  if (!data.isSuccess) throw new Error(data.message);
};
