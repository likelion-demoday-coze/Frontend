import { useId } from 'react';
import type { ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import completeIcon from '../../assets/payment/pay_complete.svg';
import cancelledIcon from '../../assets/payment/pay_cancle.svg';
import failureIcon from '../../assets/payment/pay_incomplete.svg';
import type { PaymentDetail } from '../../types/payment';
import {
  PAYMENT_ENABLED,
  PAYMENT_DISABLED_MESSAGE,
} from '../../constants/payment';
import { formatPaymentDateTime } from '../../utils/paymentFormat';
import PaymentModalFrame, { PaymentModalActions } from './PaymentModalFrame';
import type { PaymentModalAction } from './PaymentModalFrame';
import PaymentSummary from './PaymentSummary';
import type { PaymentSummaryRow } from './PaymentSummary';

type Closeable = { onClose: () => void };

export type PaymentResultModalProps =
  | { status: 'checking'; message?: string }
  | (Closeable & {
      status: 'delayed';
      onContact?: () => void;
      onHistory?: () => void;
      onRetry: () => void;
      isRetrying?: boolean;
    })
  | (Closeable & {
      status: 'success';
      payment: Pick<PaymentDetail, 'productName' | 'amount' | 'orderNumber'>;
      passPeriod: { startedAt: string; expiresAt: string } | null;
      onHistory?: () => void;
      onQuiz: () => void;
    })
  | (Closeable & {
      status: 'cancelled' | 'refunded';
      onHome: () => void;
      onShop: () => void;
    })
  | (Closeable & {
      status: 'failed';
      orderNumber: string | null;
      failureMessage: string | null;
      onShop: () => void;
      onRetry: () => void;
      onContact?: () => void;
      isRetrying?: boolean;
    });

const TITLES = {
  checking: '결제를 확인하고 있어요',
  delayed: '확인이 늦어지고 있어요',
  success: '결제가 완료되었습니다',
  cancelled: '결제가 취소됐어요',
  refunded: '환불이 완료됐어요',
  failed: '결제가 완료되지 않았습니다',
};

const PaymentResultModal = (props: PaymentResultModalProps) => {
  const titleId = useId();
  const isChecking = props.status === 'checking';
  const isWaiting = isChecking || props.status === 'delayed';
  const isRetrying = 'isRetrying' in props && !!props.isRetrying;
  let description: ReactNode = null;
  let rows: PaymentSummaryRow[] = [];
  let actions: {
    secondary: PaymentModalAction;
    primary: PaymentModalAction;
  } | null = null;

  switch (props.status) {
    case 'checking':
      description =
        props.message ??
        '창을 닫거나 새로고침하지 마세요. 잠시만 기다려 주세요.';
      break;
    case 'delayed':
      description = (
        <>
          결제가 완료됐다면 잠시 후 결제 내역에 표시돼요.
          <br />
          결제 내역에 없다면 고객 문의로 알려 주세요.
        </>
      );
      actions = {
        secondary: {
          label: props.onContact ? '고객문의' : '고객문의 준비 중',
          onClick: props.onContact ?? (() => {}),
          disabled: isRetrying || !props.onContact,
        },
        primary: {
          label: props.onHistory ? '결제 내역 보기' : '결제 내역 준비 중',
          onClick: props.onHistory ?? (() => {}),
          disabled: isRetrying || !props.onHistory,
        },
      };
      break;
    case 'success':
      rows = [
        { label: '상품', value: props.payment.productName },
        {
          label: '이용 기간',
          value: props.passPeriod
            ? `${formatPaymentDateTime(props.passPeriod.startedAt)} ~ ${formatPaymentDateTime(props.passPeriod.expiresAt)}`
            : '이용 기간 확인 중',
        },
        {
          label: '결제 금액',
          value: `${props.payment.amount.toLocaleString('ko-KR')}원`,
        },
        { label: '주문번호', value: props.payment.orderNumber },
      ];
      actions = {
        secondary: {
          label: props.onHistory ? '결제 내역' : '결제 내역 준비 중',
          onClick: props.onHistory ?? (() => {}),
          disabled: !props.onHistory,
        },
        primary: { label: '퀴즈 풀러가기', onClick: props.onQuiz },
      };
      break;
    case 'cancelled':
    case 'refunded':
      description =
        props.status === 'refunded'
          ? '환불이 완료되어 패스 이용이 종료됐어요.'
          : '필요할 때 다시 구매할 수 있어요.';
      actions = {
        secondary: { label: '홈으로', onClick: props.onHome },
        primary: { label: '상점으로', onClick: props.onShop },
      };
      break;
    case 'failed':
      description = '결제 처리 중 문제가 생겼어요.';
      rows = [
        {
          label: '사유',
          value: props.failureMessage || '결제 결과를 확인해 주세요.',
          emphasis: 'red',
        },
        { label: '주문번호', value: props.orderNumber || '-' },
      ];
      actions = {
        secondary: {
          label: '상점으로',
          onClick: props.onShop,
          disabled: isRetrying,
        },
        primary: {
          label: isRetrying ? '결제 준비 중...' : '다시 결제하기',
          onClick: props.onRetry,
          disabled: isRetrying || !PAYMENT_ENABLED,
        },
      };
      break;
  }

  return (
    <PaymentModalFrame
      titleId={titleId}
      onClose={props.status === 'checking' ? undefined : props.onClose}
      isBusy={isChecking || isRetrying}
    >
      <div
        role={isChecking ? 'status' : undefined}
        className={`flex flex-col items-center text-center ${isChecking ? 'py-2' : ''}`}
      >
        {isWaiting ? (
          <LoaderCircle
            aria-hidden="true"
            className={`size-12 text-blue-60 ${isChecking ? 'animate-spin motion-reduce:animate-none' : ''}`}
            strokeWidth={1.5}
          />
        ) : (
          <img
            src={
              props.status === 'success'
                ? completeIcon
                : props.status === 'cancelled' || props.status === 'refunded'
                  ? cancelledIcon
                  : failureIcon
            }
            alt=""
            className="size-14"
          />
        )}
        <h2
          id={titleId}
          className={`${isWaiting ? 'mt-5' : 'mt-7'} text-lg font-bold`}
        >
          {TITLES[props.status]}
        </h2>
        {description && (
          <p
            className={`mt-3 text-sm leading-6 text-gray-60 ${isChecking ? 'max-w-68' : ''}`}
          >
            {description}
          </p>
        )}
      </div>
      {rows.length > 0 && <PaymentSummary rows={rows} />}
      {props.status === 'failed' && (
        <p className="mt-3 text-center text-xs leading-5 text-gray-60">
          계속 실패하면{' '}
          <button
            type="button"
            onClick={props.onContact}
            disabled={isRetrying || !props.onContact}
            className="cursor-pointer font-semibold underline underline-offset-2"
          >
            {props.onContact ? '고객 문의' : '고객 문의(준비 중)'}
          </button>
          로 알려 주세요.
        </p>
      )}
      {props.status === 'failed' && !PAYMENT_ENABLED && (
        <p role="status" className="mt-3 text-center text-xs text-gray-60">
          {PAYMENT_DISABLED_MESSAGE}
        </p>
      )}
      {actions && <PaymentModalActions {...actions} />}
      {props.status === 'delayed' && (
        <button
          type="button"
          onClick={props.onRetry}
          disabled={isRetrying}
          className="mx-auto mt-4 block cursor-pointer text-xs font-semibold text-blue-60 underline underline-offset-2 disabled:cursor-not-allowed"
        >
          {isRetrying ? '다시 확인 중...' : '결제 상태 다시 확인'}
        </button>
      )}
    </PaymentModalFrame>
  );
};

export default PaymentResultModal;
