export type RankingType = 'regular' | 'afterhours';

export interface RankItem {
  memberId?: number;
  rank: number;
  nickname: string;
  score: string | number;
  profileImage?: string | null;
}

export interface MyRank extends RankItem {
  change?: number; //등수 변동
}

// 페이지 정보 (page는 0부터 시작)
export interface PageInfo {
  page: number;
  size: number;
  hasNext: boolean;
}

//전체 랭킹(시간외 거래)
export interface TimeAttackRankingEntry {
  rankingPosition: number;
  memberId: number;
  nickname: string;
  correctCount: number;
}

// 내 랭킹(시간외 거래)
export interface TimeAttackMyRanking {
  rankingPosition: number;
  topPercent: number;
  correctCount: number;
}

//전체 데이터(시간외거래))
export interface TimeAttackRanking {
  rankingDate: string;
  totalMemberCount: number;
  averageCorrectCount: number;
  rankings: TimeAttackRankingEntry[];
  myRanking: TimeAttackMyRanking | null; // 오늘 미참여면 null
  page: { page: number; size: number; hasNext: boolean };
}

export interface StockRankingEntry {
  rankingPosition: number;
  memberId: number;
  nickname: string;
  currentStock: number;
}

//내 랭킹(정규장)
export interface StockMyRanking {
  rankingPosition: number;
  topPercent: number;
  currentStock: number;
}

//전체 데이터(정규장)
export interface StockRanking {
  rankedAt: string;
  totalMemberCount: number;
  averageStock: number;
  rankings: StockRankingEntry[];
  myRanking: StockMyRanking | null;
  page: { page: number; size: number; hasNext: boolean };
}
