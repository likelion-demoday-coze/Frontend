import { useEffect, useId, useRef } from 'react';
import recoveryImage from '../../assets/store/Recover_Ticket_Orange.svg';

interface RecoveryPurchaseModalProps {
  price: number;
  fishBalance: number | null;
  isPurchasing: boolean;
  isRefreshing: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: () => void;
}

const RecoveryPurchaseModal = ({
  price,
  fishBalance,
  isPurchasing,
  isRefreshing,
  errorMessage,
  onClose,
  onConfirm,
}: RecoveryPurchaseModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const insufficient = fishBalance !== null && fishBalance < price;
  const after =
    fishBalance !== null && !insufficient ? fishBalance - price : null;
  const canPurchase =
    !isPurchasing && !isRefreshing && fishBalance !== null && !insufficient;
  const message = errorMessage || (insufficient ? 'FISH가 부족합니다.' : '');

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-busy={isPurchasing || isRefreshing}
      onCancel={(event) => {
        event.preventDefault();
        if (!isPurchasing) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-105 overflow-y-auto rounded-3xl border-0 bg-white p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden backdrop:bg-black/30 sm:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <img src={recoveryImage} alt="" className="size-28 object-contain" />
        <h2 id={titleId} className="mt-5 text-xl font-bold">
          복구권을 교환할까요?
        </h2>
        <p className="mt-2 text-sm text-gray-60">연속학습 복구권 1개</p>
      </div>
      <dl className="mt-5 divide-y divide-gray-20 rounded-xl bg-gray-05 px-4 text-sm">
        {[
          {
            label: '필요 FISH',
            value: price.toLocaleString('ko-KR'),
            color: 'text-gray-60',
          },
          {
            label: '보유 FISH',
            value: fishBalance?.toLocaleString('ko-KR') ?? '-',
            color: 'text-gray-40',
          },
          {
            label: '교환 후 FISH',
            value: after?.toLocaleString('ko-KR') ?? '-',
            color: 'text-blue-60',
          },
        ].map((row) => (
          <div key={row.label} className="flex justify-between gap-3 py-3">
            <dt className="font-semibold text-gray-60">{row.label}</dt>
            <dd className={`font-semibold ${row.color}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-center text-xs leading-5 text-gray-60">
        교환한 복구권은 FISH로 되돌릴 수 없습니다.
      </p>
      {isRefreshing && (
        <p role="status" className="mt-3 text-center text-xs text-gray-60">
          FISH 잔액을 확인하고 있어요.
        </p>
      )}
      {message && (
        <p role="alert" className="mt-3 text-center text-xs text-red-55">
          {message}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPurchasing}
          className="min-h-14 flex-1 cursor-pointer rounded-xl border border-gray-20 px-3 py-3 text-sm font-semibold text-gray-40 disabled:cursor-not-allowed"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canPurchase}
          className="min-h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-20 disabled:text-gray-40"
        >
          {isPurchasing
            ? '교환 중...'
            : `FISH ${price.toLocaleString('ko-KR')} 교환하기`}
        </button>
      </div>
    </dialog>
  );
};

export default RecoveryPurchaseModal;
