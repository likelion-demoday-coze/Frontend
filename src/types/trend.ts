export interface TrendItem {
  id: number;
  category: string;
  title: string;
}

export interface EconomicTrendItem {
  trendId: number;
  displayOrder: number;
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
  summary: string; //요약
  terms: {
    name: string;
    description: string; //용어
  }[];
  references: {
    title: string;
    url: string;
    publisher: string;
    publishedDate: string;
  }[];
}
