export interface EconomicTrendItem {
  id: number;
  category: string; // 예: '거시경제'
  title: string;
}

export interface TodayEconomicTrend {
  date: string;
  contentDate: string | null; //빈배열도 반환함
  generatedAt: string | null;
  status: 'READY' | 'PREPARING';
  message: string;
  items: EconomicTrendItem[];
}

export interface EconomicTrendDetail extends EconomicTrendItem {
  contentDate: string;
  generatedAt: string;
  summary: string;
  terms: {
    name: string;
    description: string;
  }[];
  references: {
    title: string;
    url: string;
    publisher: string;
    publishedDate: string;
  }[];
}
