export type StockPeriod = 'DAY' | 'WEEK' | 'ALL';

export interface StockPoint {
  timestamp: string; // ISO 시각
  stockValue: number;
}

export interface StockHistory {
  period: StockPeriod;
  from: string;
  asOf: string;
  estimatedStart: boolean; // 시작값이 추정치인지
  startStock: number;
  currentStock: number;
  changeAmount: number;
  changeRate: number;
  points: StockPoint[];
}
