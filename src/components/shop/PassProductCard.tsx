import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import passImage from '../../assets/store/Pass_Big.svg';
import { PAYMENT_ENABLED, PAYMENT_DISABLED_MESSAGE } from '../../constants/payment';

const BENEFITS = [
  '정규장 문제 풀이 FISH 차감 없이 무제한',
  '연속 학습 복구 무료',
  '정규장 주가 반영 횟수 업그레이드(2회→3회)',
];

interface PassProductCardProps {
  passStatus: 'loading' | 'active' | 'inactive' | 'error';
  saleEndsAt?: string;
  serviceEndsAt?: string;
}

const PassProductCard = ({ passStatus, saleEndsAt, serviceEndsAt }: PassProductCardProps) => {
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
  const label = isSaleEnded ? '판매 종료' : passStatus === 'active' ? '이용 중' : '₩ 1,900';
  const description = isSaleEnded
    ? serviceEndsAt ? `서비스 ${formatDate(serviceEndsAt)}까지 이용 가능` : '패스 판매가 종료되었어요'
    : passStatus === 'active' ? '만료 후 다시 구매할 수 있어요'
    : passStatus === 'loading' ? '이용 상태 확인 중...'
    : passStatus === 'error' ? '이용 상태를 확인하지 못했어요'
    : !PAYMENT_ENABLED ? PAYMENT_DISABLED_MESSAGE
    : saleEndsAt ? `${formatDate(saleEndsAt)}까지 구매 가능 · 구매 준비 중` : '구매 준비 중';

  return (
  <article className="flex flex-col gap-8 rounded-3xl border border-gray-20 bg-white p-6 sm:flex-row sm:items-center lg:gap-12 lg:p-9">
    <div className="flex size-44 shrink-0 items-center justify-center self-center rounded-3xl bg-blue-05 lg:size-48">
      <img src={passImage} alt="파란색 1주일 패스" className="size-full object-contain p-2" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-xl font-bold text-black">1주일 패스</h3>
      <p className="mt-2 text-sm text-gray-60">7일 동안 마음껏 풀고, 더 빨리 성장해요</p>
      <ul className="mt-5 space-y-2 text-xs text-gray-60">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <Check aria-hidden="true" className="size-4 shrink-0 text-green-65" />
            {benefit}
          </li>
        ))}
      </ul>
      <p className="mt-2 pl-6 text-xs text-red-55">• 타임어택 횟수는 증가하지 않습니다.</p>
    </div>
    <div className="shrink-0 self-end sm:self-center">
      <button type="button" disabled title={description} className={`h-16 w-36 cursor-not-allowed rounded-xl border text-xl font-bold ${isSaleEnded || passStatus === 'active' ? 'border-gray-20 bg-gray-20 text-gray-40' : 'border-blue-60 bg-white text-blue-60'}`}>
        {label}
      </button>
      <p className="mt-2 max-w-44 text-center text-xs text-gray-60">{description}</p>
    </div>
  </article>
  );
};

export default PassProductCard;
