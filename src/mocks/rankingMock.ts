import type { MyRank, RankItem, RankingType } from '../types/ranking';

const makeItems = (score: string | number): RankItem[] =>
  Array.from({ length: 8 }, (_, i) => ({
    rank: i + 1,
    nickname: '방울모아태산',
    score,
  }));

export const MOCK_RANKING: Record<
  RankingType,
  {
    me: MyRank;
    items: RankItem[];
    lastRank: number;
    stats: { label: string; value: string }[];
  }
> = {
  regular: {
    me: { rank: 125, change: 17, nickname: 'COZ:Y_화팅', score: '275.00' },
    items: makeItems('2,750.00'),
    lastRank: 2432,
    stats: [
      { label: '상위', value: '13.9%' },
      { label: '나의 누적 주가', value: '275.00 방울' },
      { label: '유저 평균 주가', value: '115.30 방울' },
    ],
  },
  afterhours: {
    me: { rank: 125, change: 17, nickname: 'COZ:Y_화팅', score: 22 },
    items: makeItems(22),
    lastRank: 2432,
    stats: [
      { label: '상위', value: '13.9%' },
      { label: '나의 최고 기록', value: '22문제' },
      { label: '유저 평균 정답수', value: '15문제' },
    ],
  },
};
