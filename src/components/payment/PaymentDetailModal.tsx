import { useEffect, useId, useState } from 'react';
import { X } from 'lucide-react';
import { getPaymentDetail } from '../../api/payment';
import type { PaymentDetail } from '../../types/payment';
import passImage from '../../assets/store/Pass_Big.svg';
import { formatPaymentDateTime } from '../../utils/paymentFormat';
import PaymentModalFrame from './PaymentModalFrame';
import PaymentSummary from './PaymentSummary';
import type { PaymentSummaryRow } from './PaymentSummary';

interface PaymentDetailModalProps {
  paymentId: number;
  onClose: () => void;
  onRefund: (payment: PaymentDetail) => void;
}

const STATUS_LABELS: Record<string, string> = {
  READY: '결제 대기',
  PAYMENT_REQUESTED: '결제 진행 중',
  APPROVED: '결제 완료',
  COMPLETED: '결제 완료',
  CANCEL_REQUESTED: '환불 처리 중',
  REFUNDED: '환불 완료',
  CANCELLED: '결제 취소',
  FAILED: '결제 실패',
};

const receiptLink = (value: string | null) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export default function PaymentDetailModal({
  paymentId,
  onClose,
  onRefund,
}: PaymentDetailModalProps) {
  const titleId = useId();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getPaymentDetail(paymentId)
      .then((result) => {
        if (!result || result.paymentId !== paymentId)
          throw new Error('결제 정보가 일치하지 않아요.');
        if (active) setPayment(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [paymentId, attempt]);

  const rows: PaymentSummaryRow[] = payment
    ? [
        {
          label: '결제 일시',
          value: payment.paidAt
            ? formatPaymentDateTime(payment.paidAt, true)
            : '-',
        },
        {
          label: '결제 수단',
          value: payment.payMethod
            ? `${payment.payMethod.toLowerCase() === 'card' ? '신용카드' : payment.payMethod}${payment.cardName ? ` (${payment.cardName})` : ''}`
            : '-',
        },
        {
          label: '이용 기간',
          value:
            payment.passStartedAt && payment.passExpiresAt
              ? `${formatPaymentDateTime(payment.passStartedAt)} ~ ${formatPaymentDateTime(payment.passExpiresAt)}`
              : '-',
        },
        { label: '주문번호', value: payment.orderNumber },
      ]
    : [];
  if (payment?.status === 'CANCEL_REQUESTED')
    rows.push({
      label: '환불 신청',
      value: payment.cancellationRequestedAt
        ? formatPaymentDateTime(payment.cancellationRequestedAt, true)
        : '-',
    });
  if (payment?.status === 'REFUNDED')
    rows.push(
      {
        label: '환불 일시',
        value: payment.refundedAt
          ? formatPaymentDateTime(payment.refundedAt, true)
          : '-',
      },
      {
        label: '환불 금액',
        value:
          payment.refundedAmount != null
            ? `₩ ${payment.refundedAmount.toLocaleString('ko-KR')}`
            : '-',
        emphasis: 'red',
      }
    );
  const receiptUrl = receiptLink(payment?.receiptUrl ?? null);

  return (
    <PaymentModalFrame titleId={titleId} onClose={onClose} maxWidth={432}>
      <div className="flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-sm font-bold text-black">
          결제 상세
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="결제 상세 닫기"
          className="shrink-0 cursor-pointer rounded-full bg-gray-20 p-1 text-gray-60"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      {error ? (
        <div className="py-8 text-center">
          <p role="alert" className="text-sm text-gray-60">
            결제 상세를 불러오지 못했어요.
          </p>
          <button
            type="button"
            onClick={() => {
              setError(false);
              setAttempt((value) => value + 1);
            }}
            className="mt-4 cursor-pointer rounded-lg border border-blue-60 px-4 py-2 text-sm text-blue-60"
          >
            다시 시도
          </button>
        </div>
      ) : !payment ? (
        <p role="status" className="py-8 text-center text-sm text-gray-60">
          결제 상세를 불러오는 중이에요.
        </p>
      ) : (
        <>
          <div className="mt-5 flex items-center gap-2">
            <img
              src={passImage}
              alt=""
              className="size-12 shrink-0 rounded-xl bg-blue-05 object-contain"
            />
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <strong className="text-sm font-bold text-black">
                {payment.productName}
              </strong>
              <span
                className={`rounded-md border px-2 py-1 text-xs font-semibold ${payment.status === 'CANCEL_REQUESTED' ? 'border-yellow-45 text-red-55' : payment.status === 'REFUNDED' || payment.status === 'CANCELLED' ? 'border-gray-40 text-gray-40' : 'border-blue-60 text-blue-60'}`}
              >
                {STATUS_LABELS[payment.status] ?? '확인 중'}
              </span>
            </div>
            <strong
              className={`shrink-0 text-sm font-bold ${payment.status === 'REFUNDED' ? 'text-gray-40' : 'text-black'}`}
            >
              ₩ {payment.amount.toLocaleString('ko-KR')}
            </strong>
          </div>
          <PaymentSummary rows={rows} compact />
          {receiptUrl && (
            <>
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-xl border border-gray-20 px-4 py-3 text-center text-sm font-semibold text-gray-80"
              >
                영수증 보기 ↗
              </a>
            </>
          )}
          {(receiptUrl || payment.refundable === true) && (
            <div className="mt-3 flex items-center justify-between gap-2">
              {receiptUrl && (
                <p className="min-w-0 flex-1 text-[10px] text-gray-40 sm:text-xs">
                  페이앱 매출전표가 새 창으로 열려요.
                </p>
              )}
              {payment.refundable === true && (
                <button
                  type="button"
                  onClick={() => onRefund(payment)}
                  className="ml-auto shrink-0 cursor-pointer text-xs font-semibold text-red-55 underline underline-offset-2"
                >
                  환불하기
                </button>
              )}
            </div>
          )}
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-7 block min-h-12 w-32 cursor-pointer rounded-xl border border-gray-20 px-4 py-3 text-sm font-semibold text-gray-60"
      >
        닫기
      </button>
    </PaymentModalFrame>
  );
}
