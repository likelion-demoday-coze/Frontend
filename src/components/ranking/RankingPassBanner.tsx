import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import timerIcon from '../../assets/icons/timer.svg';
import passIcon from '../../assets/navbar/pass_icon.svg';
import { PASS_SALES_END_AT } from '../../constants/pass';
import { WEEK_PASS_PRODUCT } from '../../constants/payment';
import { ROUTES } from '../../constants/routes';
import type { PassOrCash } from '../../types/PassOrCash';

interface RankingPassBannerProps {
  pass: PassOrCash;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const saleEndMs = PASS_SALES_END_AT.getTime();
const saleEndKst = new Date(saleEndMs + KST_OFFSET_MS);
const saleEndLabel = `${saleEndKst.getUTCMonth() + 1}/${saleEndKst.getUTCDate()}(${['일', '월', '화', '수', '목', '금', '토'][saleEndKst.getUTCDay()]}) ${String(saleEndKst.getUTCHours()).padStart(2, '0')}:${String(saleEndKst.getUTCMinutes()).padStart(2, '0')}`;

const RankingPassBanner = ({ pass }: RankingPassBannerProps) => {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // 조회 중이거나 실패했을 때 미보유 사용자로 잘못 안내하지 않음
  if (!pass.hasPass && pass.status !== 'inactive') return null;

  const saleEnded = now >= saleEndMs;
  const daysUntilSaleEnd = Math.max(
    0,
    Math.floor((saleEndMs + KST_OFFSET_MS) / DAY_MS) -
      Math.floor((now + KST_OFFSET_MS) / DAY_MS)
  );
  const deadline = saleEnded
    ? '판매 종료'
    : `판매 마감까지 ${daysUntilSaleEnd === 0 ? 'D-DAY' : `D-${daysUntilSaleEnd}`}`;

  return (
    <Link
      to={ROUTES.SHOP}
      className="mb-3 flex items-center rounded-lg bg-blue-05 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-60 lg:mb-5"
    >
      <div className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto] lg:gap-3">
        <img
          src={passIcon}
          alt=""
          className="size-8 shrink-0 object-contain lg:size-11"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-80">
            {pass.hasPass ? (
              <>
                패스가{' '}
                <span className="text-blue-60">{pass.remainingDays}일</span>{' '}
                남았어요
              </>
            ) : saleEnded ? (
              '패스 판매가 종료됐어요'
            ) : (
              <>
                패스로 주가 반영 <span className="text-blue-60">하루 3번!</span>
              </>
            )}
          </p>
          <p className="mt-1 truncate text-[12px] text-gray-60">
            {pass.hasPass
              ? `※ ${saleEndLabel} 이후엔 다시 살 수 없어요`
              : `※ ${WEEK_PASS_PRODUCT.passDurationHours / 24}일 ${WEEK_PASS_PRODUCT.price.toLocaleString('ko-KR')}원 · ${saleEndLabel} 판매 종료`}
          </p>
        </div>
        <span className="hidden shrink-0 flex-nowrap items-center gap-1 rounded-lg border border-blue-60 bg-white px-2 py-2 text-[14px] font-semibold whitespace-nowrap text-blue-60 sm:px-3 sm:text-xs lg:inline-flex">
          <img src={timerIcon} alt="" className="size-5 shrink-0 sm:size-4" />
          <span className="whitespace-nowrap">{deadline}</span>
        </span>
        <ChevronRight
          aria-hidden="true"
          className="size-3 text-gray-40 lg:size-4"
        />
      </div>
    </Link>
  );
};

export default RankingPassBanner;
