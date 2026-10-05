export interface MyRankSummary {
  title: string; // '주가 랭킹' | '시간외거래 랭킹'
  rank: number;
  change: number; // 양수 ▲, 음수 ▼
  footnote: string; // '124위까지 +3.2방울' | '초기화까지 03:12:00'
  stats: { label: string; value: string }[]; // 알약 2개
}
