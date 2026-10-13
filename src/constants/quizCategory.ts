import corporateFinanceIcon from '../assets/quiz/category/corporate_finance.png';
import exchangeGlobalEconomyIcon from '../assets/quiz/category/exchange_global_economy.png';
import financialMarketIcon from '../assets/quiz/category/financial_market.png';
import interestBondIcon from '../assets/quiz/category/interest_bond.png';
import livingEconomyIcon from '../assets/quiz/category/living_economy.png';
import macroEconomyIcon from '../assets/quiz/category/macro_economy.png';
import realEstateIcon from '../assets/quiz/category/real_estate.png';
import stockInvestmentIcon from '../assets/quiz/category/stock_investment.png';
import type { QuizCategory } from '../types/quiz';

interface QuizCategoryInfo {
  label: string;
  description: string;
  icon: string;
}

// 카테고리 선택 화면 표시 순서 (Figma 기준)
export const QUIZ_CATEGORIES: QuizCategory[] = [
  'MACRO_ECONOMY',
  'FINANCIAL_MARKET',
  'STOCK_INVESTMENT',
  'INTEREST_BOND',
  'EXCHANGE_GLOBAL_ECONOMY',
  'REAL_ESTATE',
  'CORPORATE_FINANCE',
  'LIVING_ECONOMY',
];

export const QUIZ_CATEGORY_INFO: Record<QuizCategory, QuizCategoryInfo> = {
  MACRO_ECONOMY: {
    label: '거시경제',
    description: '물가, GDP 등 국가 경제의 큰 흐름',
    icon: macroEconomyIcon,
  },
  FINANCIAL_MARKET: {
    label: '금융시장',
    description: '은행, 펀드 등 자본이 이동하는 생태계',
    icon: financialMarketIcon,
  },
  STOCK_INVESTMENT: {
    label: '주식·투자',
    description: '시장 트렌드 파악 및 실전 투자 감각',
    icon: stockInvestmentIcon,
  },
  INTEREST_BOND: {
    label: '금리·채권',
    description: '경제의 기준인 금리와 안전 자산의 원리',
    icon: interestBondIcon,
  },
  EXCHANGE_GLOBAL_ECONOMY: {
    label: '환율·국제경제',
    description: '환율 변동과 얽혀있는 글로벌 무역 이슈',
    icon: exchangeGlobalEconomyIcon,
  },
  REAL_ESTATE: {
    label: '부동산',
    description: '청약, 대출 등 주택 시장 트렌드와 흐름',
    icon: realEstateIcon,
  },
  CORPORATE_FINANCE: {
    label: '기업·재무',
    description: '재무제표 분석을 통한 기업 가치 파악',
    icon: corporateFinanceIcon,
  },
  LIVING_ECONOMY: {
    label: '생활경제',
    description: '세금, 소비 등 내 지갑과 직결된 실용 지식',
    icon: livingEconomyIcon,
  },
};
