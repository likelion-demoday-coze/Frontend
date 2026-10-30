import type { TrendItem } from '../../../types/trend';
import macroEconomy from '../../../assets/home/category/macro_economy_blur.svg';
import financialMarket from '../../../assets/home/category/financial_market_blur.svg';
import stockInvestment from '../../../assets/home/category/stock_investment_blur.svg';
import interestBond from '../../../assets/home/category/interest_bond_blu.svg';
import exchangeGlobalEconomy from '../../../assets/home/category/exchange_global_economy_blur.svg';
import realEstate from '../../../assets/home/category/real_estate_blur.svg';
import corporateFinance from '../../../assets/home/category/corporate_finance_blur.svg';
import livingEconomy from '../../../assets/home/category/living_economy_blur.svg';

type TrendCardProps = Omit<TrendItem, 'id'> & {
  categoryCode: string;
  onClick: () => void;
};

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  MACRO_ECONOMY: macroEconomy,
  FINANCIAL_MARKET: financialMarket,
  STOCK_INVESTMENT: stockInvestment,
  INTEREST_BOND: interestBond,
  EXCHANGE_GLOBAL_ECONOMY: exchangeGlobalEconomy,
  REAL_ESTATE: realEstate,
  CORPORATE_FINANCE: corporateFinance,
  LIVING_ECONOMY: livingEconomy,
};

const TrendCard = ({ category, categoryCode, title, onClick }: TrendCardProps) => {
  const background = CATEGORY_BACKGROUNDS[categoryCode];

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className="relative overflow-hidden flex flex-col justify-end rounded-2xl border border-gray-20 bg-white px-4 h-55.75 py-12.5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60"
    >
      {background && (
        <img
          src={background}
          alt=""
          className="pointer-events-none absolute top-0 right-0 w-49.25 h-43 object-contain object-top-right"
        />
      )}
      <span className="relative block text-[16px] text-gray-60">{category}</span>
      <span className="relative line-clamp-2 break-words text-[16px] text-black font-semibold">{title}</span>
      <span className="absolute inset-x-4 bottom-4 text-center text-sm text-gray-40">
        클릭하여 상세보기
      </span>
    </button>
  );
};

export default TrendCard;
