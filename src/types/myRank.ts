export interface MyRankSummary {
  title: string; // '주가 랭킹' | '시간외거래 랭킹'
  rank: number;
  change?: number; // 양수 ▲, 음수 ▼
  footnote?: string; //
  stats: { label: string; value: string }[]; // 알약 2개
}
