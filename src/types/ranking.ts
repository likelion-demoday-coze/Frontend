export type RankingType = 'regular' | 'afterhours';

export interface RankItem {
  rank: number;
  nickname: string;
  score: string | number;
  profileImage?: string | null;
}

export interface MyRank extends RankItem {
  change?: number; //등수 변동
}
