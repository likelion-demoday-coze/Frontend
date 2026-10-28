export interface MyRankSummary {
  title: string; // '주가 랭킹' | '시간외거래 랭킹'
  rank: number | null;
  change?: number; // 양수 ▲, 음수 ▼
  footnote?: string; //
  challengeTo?: string;
  resetAt?: number; // 시간외거래 랭킹 날짜의 다음 한국 시간 자정
  stats: { label: string; value: string }[]; // 알약 2개
}
