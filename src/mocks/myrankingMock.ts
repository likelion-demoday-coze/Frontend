import type { MyRankSummary } from '../types/myRank';

export const MOCK_MY_RANKS: MyRankSummary[] = [
  {
    title: '주가 랭킹',
    rank: 125,
    change: 17,
    footnote: '124위까지 +3.2방울',
    stats: [
      { label: '상위', value: '13.9%' },
      { label: '주가', value: '275.00' },
    ],
  },
  {
    title: '시간외거래 랭킹',
    rank: 125,
    change: 17,
    footnote: '초기화까지 03:12:00',
    stats: [
      { label: '상위', value: '13.9%' },
      { label: '최고', value: '22문제' },
    ],
  },
];
