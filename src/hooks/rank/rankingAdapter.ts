import { getStockRanking, getTimeAttackRanking } from '../../api/ranking';
import type { RankingPageResult } from './usePagedRanking';

const PAGE_SIZE = 20;

//정규장
export const fetchStockPage = async (
  page: number
): Promise<RankingPageResult> => {
  const response = await getStockRanking(page, PAGE_SIZE);
  return {
    items: response.rankings.map((res) => ({
      memberId: res.memberId,
      rank: res.rankingPosition,
      nickname: res.nickname,
      score: res.currentStock.toFixed(2), //주가는 소수 둘자리까지
    })),
    totalMemberCount: response.totalMemberCount,
    hasNext: response.page.hasNext,
    my: response.myRanking
      ? {
          rank: response.myRanking.rankingPosition,
          score: response.myRanking.currentStock.toFixed(2),
        }
      : null,
    stats: response.myRanking
      ? [
          { label: '상위', value: `${response.myRanking.topPercent}%` },
          {
            label: '나의 누적 주가',
            value: `${response.myRanking.currentStock.toFixed(2)} 방울`,
          },
          {
            label: '유저 평균 주가',
            value: `${response.averageStock.toFixed(2)} 방울`,
          },
        ]
      : [],
  };
};

//시간외 거래
export const fetchTimeAttackPage = async (
  page: number
): Promise<RankingPageResult> => {
  const response = await getTimeAttackRanking(page, PAGE_SIZE);
  return {
    items: response.rankings.map((res) => ({
      memberId: res.memberId,
      rank: res.rankingPosition,
      nickname: res.nickname,
      score: res.correctCount,
    })),
    totalMemberCount: response.totalMemberCount,
    hasNext: response.page.hasNext,
    my: response.myRanking
      ? {
          rank: response.myRanking.rankingPosition,
          score: response.myRanking.correctCount,
        }
      : null,
    stats: response.myRanking
      ? [
          { label: '상위', value: `${response.myRanking.topPercent}%` },
          {
            label: '나의 최고 기록',
            value: `${response.myRanking.correctCount}문제`,
          },
          {
            label: '유저 평균 정답수',
            value: `${response.averageCorrectCount}문제`,
          },
        ]
      : [],
  };
};
