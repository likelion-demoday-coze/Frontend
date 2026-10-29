import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import fishImage from '../../assets/store/Fish_a.svg';
import { getFishTransactions } from '../../api/fish';
import { getPaymentHistories } from '../../api/payment';
import { ROUTES } from '../../constants/routes';
import type { FishTransaction, FishTransactionType } from '../../types/fish';
import type { PaymentHistory } from '../../types/payment';
import { formatMonthDay, formatTime } from '../../utils/date';

type HistoryTab = 'fish' | 'payment';

const FISH_PAGE_SIZE = 6;

const fishLabels: Record<FishTransactionType, string> = {
  ATTENDANCE_REWARD: '출석 보상',
  RANKING_REWARD: '랭킹 보상',
  DAILY_QUIZ_COST: '정규장 입장',
  TIME_ATTACK_COST: '시간외거래 입장',
  ITEM_PURCHASE: '연속학습 복구권 구매',
  PAYMENT_CANCEL: '결제 취소',
  ADMIN_ADJUSTMENT: '운영 조정',
};

const paymentStatus: Record<string, { label: string; style: string }> = {
  COMPLETED: { label: '결제 완료', style: 'border-blue-60 text-blue-60' },
  REFUNDED: { label: '환불 완료', style: 'border-gray-20 text-gray-60' },
  CANCELLED: { label: '결제 취소', style: 'border-gray-20 text-gray-60' },
  CANCEL_REQUESTED: {
    label: '취소 요청',
    style: 'border-gray-20 text-gray-60',
  },
  FAILED: { label: '결제 실패', style: 'border-red-55 text-red-55' },
};
const pendingStatus = {
  label: '확인 중',
  style: 'border-gray-20 text-gray-60',
};

const tabs: { value: HistoryTab; label: string }[] = [
  { value: 'fish', label: 'FISH 내역' },
  { value: 'payment', label: '결제 내역' },
];

const RetryMessage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center gap-3 py-4 text-center">
    <p className="text-sm text-gray-60">
      내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="cursor-pointer rounded-full border border-blue-60 px-4 py-1.5 text-sm font-semibold text-blue-60"
    >
      다시 시도
    </button>
  </div>
);

const EmptyHistory = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center gap-2 py-6 text-center">
    {icon}
    <strong className="text-base font-semibold text-black">{title}</strong>
    <p className="text-sm break-keep text-gray-40">{description}</p>
    <Link
      to={ROUTES.SHOP}
      className="mt-3 rounded-lg bg-blue-60 px-4 py-2.5 text-sm font-semibold text-white"
    >
      상점 가기
    </Link>
  </div>
);

//마이페이지 이용 내역 (FISH 내역 / 결제 내역)
const UsageHistory = () => {
  const [tab, setTab] = useState<HistoryTab>('fish');
  const [fishItems, setFishItems] = useState<FishTransaction[] | null>(null);
  const [fishPage, setFishPage] = useState(0);
  const [hasNextFish, setHasNextFish] = useState(false);
  const [isFishLoading, setIsFishLoading] = useState(true);
  const [isFishError, setIsFishError] = useState(false);
  const [fishReloadKey, setFishReloadKey] = useState(0);
  const [payments, setPayments] = useState<PaymentHistory[] | null>(null);
  const [isPaymentError, setIsPaymentError] = useState(false);

  useEffect(() => {
    let ignore = false;
    getFishTransactions(fishPage, FISH_PAGE_SIZE)
      .then((data) => {
        if (ignore) return;
        setFishItems((prev) =>
          fishPage === 0 ? data.content : [...(prev ?? []), ...data.content]
        );
        setHasNextFish(data.hasNext);
        setIsFishLoading(false);
      })
      .catch((error) => {
        console.error('FISH 내역 조회 실패', error);
        if (ignore) return;
        setIsFishError(true);
        setIsFishLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fishPage, fishReloadKey]);

  useEffect(() => {
    if (tab !== 'payment' || payments || isPaymentError) return;
    let ignore = false;
    //운영 기간이 3주라 결제 내역은 한 번에 조회
    getPaymentHistories(0, 20)
      .then((data) => {
        if (!ignore) setPayments(data.payments);
      })
      .catch((error) => {
        console.error('결제 내역 조회 실패', error);
        if (!ignore) setIsPaymentError(true);
      });
    return () => {
      ignore = true;
    };
  }, [tab, payments, isPaymentError]);

  const loadMoreFish = () => {
    if (isFishLoading) return;
    setIsFishLoading(true);
    setFishPage((prev) => prev + 1);
  };

  const retryFish = () => {
    setIsFishError(false);
    setIsFishLoading(true);
    setFishReloadKey((prev) => prev + 1);
  };

  const renderFish = () => {
    if (!fishItems && isFishError) return <RetryMessage onRetry={retryFish} />;
    if (!fishItems)
      return <p className="text-sm text-gray-60">불러오는 중...</p>;
    if (fishItems.length === 0)
      return (
        <EmptyHistory
          icon={<img src={fishImage} alt="" className="size-12" />}
          title="아직 FISH 내역이 없어요"
          description="출석 보상을 받거나 퀴즈를 풀면 여기에 기록돼요"
        />
      );
    return (
      <>
        <ul className="flex w-full flex-col">
          {fishItems.map((item) => (
            <li
              key={item.transactionId}
              className="flex items-center justify-between gap-3 border-b border-gray-20 py-3"
            >
              <span className="flex items-center gap-4">
                <span className="w-12 shrink-0 text-sm font-medium text-gray-60">
                  {formatMonthDay(item.createdAt)}
                </span>
                <span className="text-sm font-semibold text-gray-80">
                  {fishLabels[item.transactionType] ?? '기타'}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <strong
                  className={`text-base font-semibold ${item.amount > 0 ? 'text-blue-60' : 'text-red-55'}`}
                >
                  {item.amount > 0 ? `+${item.amount}` : item.amount}
                </strong>
                <span className="w-16 text-right text-xs font-medium text-gray-60">
                  잔액 {item.balanceAfter.toLocaleString()}
                </span>
              </span>
            </li>
          ))}
        </ul>
        {isFishError ? (
          <RetryMessage onRetry={retryFish} />
        ) : hasNextFish ? (
          <button
            type="button"
            onClick={loadMoreFish}
            disabled={isFishLoading}
            className="mt-4 flex cursor-pointer disabled:cursor-wait disabled:opacity-50 items-center gap-2 rounded-full border border-blue-60 px-4 py-1.5 text-sm font-semibold text-blue-60"
          >
            더보기
            <ArrowIcon aria-hidden="true" className="h-4 w-2 rotate-90" />
          </button>
        ) : (
          fishPage > 0 && (
            <p className="mt-4 text-sm text-gray-40">
              가장 처음 내역까지 모두 봤어요
            </p>
          )
        )}
      </>
    );
  };

  const renderPayments = () => {
    if (isPaymentError)
      return <RetryMessage onRetry={() => setIsPaymentError(false)} />;
    if (!payments)
      return <p className="text-sm text-gray-60">불러오는 중...</p>;
    if (payments.length === 0)
      return (
        <EmptyHistory
          icon={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-12 text-gray-40"
            >
              <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" />
              <path d="M9 8h6M9 12h6M9 16h3" />
            </svg>
          }
          title="아직 결제 내역이 없어요"
          description="1주일 패스를 구매하면 여기에 기록돼요"
        />
      );
    return (
      <ul className="flex w-full flex-col">
        {payments.map((payment) => {
          const status = paymentStatus[payment.status] ?? pendingStatus;
          const paidAt = payment.approvedAt ?? payment.requestedAt;
          return (
            <li
              key={payment.paymentId}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="flex items-start gap-4">
                <span className="w-12 shrink-0 text-sm leading-[1.3] font-medium text-gray-60">
                  {formatMonthDay(paidAt)}
                  <br />
                  {formatTime(paidAt)}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <strong className="text-base font-semibold text-gray-80">
                      {payment.productName}
                    </strong>
                  </span>
                  <span className="text-xs font-medium break-all text-gray-40">
                    주문번호 {payment.orderNumber}
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3 lg:gap-6">
                <span
                  className={`rounded-lg border px-2 py-1 text-xs font-bold ${status.style}`}
                >
                  {status.label}
                </span>
                <strong className="text-base font-semibold text-black">
                  ₩ {payment.amount.toLocaleString()}
                </strong>
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-6 lg:gap-9">
        <h2 className="text-xl font-semibold text-black">이용 내역</h2>
        <div
          role="tablist"
          aria-label="이용 내역 종류"
          className="flex rounded-full bg-gray-05"
        >
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`cursor-pointer rounded-full border px-6 py-2 text-sm leading-6 font-bold ${tab === value ? 'border-blue-60 bg-white text-blue-60' : 'border-transparent text-gray-60'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-gray-20 bg-white px-4 py-4 lg:px-6">
        {tab === 'fish' ? renderFish() : renderPayments()}
      </div>
      {tab === 'payment' && (
        <p className="text-sm text-gray-40">
          결제 관련 문의는 고객센터 이메일로 주문번호를 알려 주세요.
        </p>
      )}
    </section>
  );
};

export default UsageHistory;
