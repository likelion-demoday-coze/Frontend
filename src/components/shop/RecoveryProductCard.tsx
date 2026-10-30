import type { MouseEventHandler } from 'react';
import recoveryImage from '../../assets/store/Recover_Ticket_Orange.svg';

interface RecoveryProductCardProps {
  ownedCount?: number;
  fishPrice?: number;
  disabled?: boolean;
  isPurchasing?: boolean;
  onPurchase?: MouseEventHandler<HTMLButtonElement>;
  fishBalance?: number | null;
  statusMessage?: string;
  onRetry?: () => void;
}

const RecoveryProductCard = ({
  ownedCount,
  fishPrice,
  disabled = true,
  isPurchasing = false,
  onPurchase,
  fishBalance,
  statusMessage,
  onRetry,
}: RecoveryProductCardProps) => {
  const insufficient =
    fishBalance != null && fishPrice !== undefined && fishBalance < fishPrice;
  const message = statusMessage || (insufficient ? 'FISH가 부족합니다.' : '');
  return (
    <article className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-4 gap-y-6 rounded-3xl border border-gray-20 bg-white p-5 sm:grid-cols-[80px_minmax(0,1fr)] sm:p-8 lg:grid-cols-[192px_minmax(0,1fr)_176px] lg:gap-x-8 lg:p-9">
      <div className="flex justify-center">
        <div className="size-16 rounded-2xl bg-yellow-05 sm:size-20 lg:size-30 lg:rounded-3xl">
          <img
            src={recoveryImage}
            alt="주황색 연속 학습 복구권"
            className="size-full object-contain p-2"
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-black sm:text-xl">연속 학습 복구권</h3>
          <span className="rounded bg-gray-05 px-2 py-1 text-xs font-semibold text-gray-60">
            보유 {ownedCount ?? '-'}개
          </span>
        </div>
        <p className="mt-2 text-xs leading-6 text-gray-60 sm:text-sm">
          연속학습 중단 다음 날에만 복구 가능
          <br />
          사용 후 환불 불가
        </p>
      </div>
      <div className="col-span-2 flex max-w-full flex-col items-center justify-self-center pt-2 lg:col-span-1 lg:pt-0">
        <button
          type="button"
          disabled={disabled || insufficient}
          onClick={onPurchase}
          className="h-16 w-44 max-w-full cursor-pointer rounded-xl border border-blue-60 bg-white text-xl font-bold text-blue-60 disabled:cursor-not-allowed disabled:border-gray-20 disabled:bg-gray-20 disabled:text-gray-40"
        >
          {isPurchasing
            ? '교환 중...'
            : `FISH ${fishPrice?.toLocaleString('ko-KR') ?? '-'}`}
        </button>
        {message && (
          <p className="mt-2 max-w-36 text-center text-xs text-gray-60">
            {message}
          </p>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 w-36 cursor-pointer text-center text-xs text-blue-60 underline"
          >
            다시 조회
          </button>
        )}
      </div>
    </article>
  );
};

export default RecoveryProductCard;
