import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import passImage from '../../assets/store/Pass_Big.svg';
import { PAYMENT_ENABLED, PAYMENT_DISABLED_MESSAGE, WEEK_PASS_PRODUCT } from '../../constants/payment';

const BENEFITS = [
  '정규장·시간외거래 입장 FISH 차감 없음',
  '연속 학습 복구 무료',
  '정규장 주가 반영 횟수 업그레이드(2회→3회)',
];

interface PassProductCardProps {
  passStatus: 'loading' | 'active' | 'inactive' | 'error';
  saleEndsAt?: string;
  serviceEndsAt?: string;
  onPurchase: () => void;
}

const PassProductCard = ({ passStatus, saleEndsAt, serviceEndsAt, onPurchase }: PassProductCardProps) => {
  const [now, setNow] = useState(Date.now);
  const saleEnd = saleEndsAt ? Date.parse(saleEndsAt) : null;
  const isSaleEnded = saleEnd !== null && now >= saleEnd;

  useEffect(() => {
    if (saleEnd === null || !Number.isFinite(saleEnd)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [saleEnd]);

  const formatDate = (date: string) => new Date(date).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const disabled = isSaleEnded || passStatus !== 'inactive';
  const label = isSaleEnded ? '판매 종료' : passStatus === 'active' ? '이용 중' : `₩ ${WEEK_PASS_PRODUCT.price.toLocaleString('ko-KR')}`;
  const description = isSaleEnded
    ? serviceEndsAt ? `서비스 ${formatDate(serviceEndsAt)}까지 이용 가능` : '패스 판매가 종료되었어요'
    : passStatus === 'active' ? '만료 후 다시 구매할 수 있어요'
    : passStatus === 'loading' ? '이용 상태 확인 중...'
    : passStatus === 'error' ? '이용 상태를 확인하지 못했어요'
    : !PAYMENT_ENABLED ? PAYMENT_DISABLED_MESSAGE
    : saleEndsAt ? `${formatDate(saleEndsAt)}까지 구매 가능` : '결제 후 바로 이용할 수 있어요';

  return (
  <article className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4 gap-y-6 rounded-3xl border border-gray-20 bg-white p-5 sm:grid-cols-[80px_minmax(0,1fr)] sm:p-8 lg:grid-cols-[192px_minmax(0,1fr)_176px] lg:gap-x-8 lg:p-9">
    <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-05 sm:size-20 lg:row-span-2 lg:size-48 lg:rounded-3xl">
      <img src={passImage} alt="파란색 1주일 패스" className="size-full object-contain p-2" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-xl font-bold text-black">1주일 패스</h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-60 sm:text-sm">7일 동안 마음껏 풀고, 더 빨리 성장해요</p>
    </div>
    <div className="col-span-2 min-w-0 lg:col-span-1 lg:col-start-2 lg:row-start-2">
      <ul className="space-y-3 text-xs leading-relaxed text-gray-60 sm:text-sm">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <Check aria-hidden="true" className="size-4 shrink-0 text-green-65" />
            {benefit}
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-start gap-2 pl-1 text-xs leading-relaxed text-red-55 sm:text-sm">
        <span aria-hidden="true">•</span>
        <span>시간외거래 도전 횟수(하루 3회)는 증가하지 않습니다.</span>
      </p>
    </div>
    <div className="col-span-2 flex max-w-full flex-col items-center justify-self-center pt-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:pt-0">
      <button type="button" disabled={disabled} onClick={onPurchase} title={description} className={`h-16 w-44 max-w-full cursor-pointer disabled:cursor-not-allowed rounded-xl border text-xl font-bold ${isSaleEnded || passStatus === 'active' ? 'border-gray-20 bg-gray-20 text-gray-40' : 'border-blue-60 bg-white text-blue-60'}`}>
        {label}
      </button>
      <p className="mt-2 max-w-44 text-center text-xs text-gray-60">{description}</p>
    </div>
  </article>
  );
};

export default PassProductCard;
