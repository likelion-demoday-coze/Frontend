import { useId } from 'react';
import type { ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import completeIcon from '../../assets/payment/pay_complete.svg';
import cancelledIcon from '../../assets/payment/pay_cancle.svg';
import failureIcon from '../../assets/payment/pay_incomplete.svg';
import passImage from '../../assets/store/Pass_Big.svg';
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
      status:
        | 'refund-confirm'
        | 'refund-success'
        | 'refund-pending'
        | 'refund-failed';
      amount: number;
      orderNumber: string;
      passPeriod: { startedAt: string; expiresAt: string } | null;
      isRetrying?: boolean;
      failureMessage?: string;
      onRetry: () => void;
      onHome: () => void;
      onContact: () => void;
    })
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
      onConfirm: () => void;
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
  'refund-confirm': '일주일 패스를 환불할까요?',
  'refund-success': '환불이 완료되었습니다',
  'refund-pending': '환불을 처리하고 있어요',
  'refund-failed': '환불하지 못했어요',
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
  const isWaiting =
    isChecking ||
    props.status === 'delayed' ||
    props.status === 'refund-pending';
  const isRetrying = 'isRetrying' in props && !!props.isRetrying;
  let description: ReactNode = null;
  let rows: PaymentSummaryRow[] = [];
  let actions: {
    secondary: PaymentModalAction;
    primary: PaymentModalAction;
  } | null = null;

  switch (props.status) {
    case 'refund-confirm':
      description = `${props.amount.toLocaleString('ko-KR')}원이 전액 환불되고, 패스 혜택은 바로 종료돼요.`;
      rows = [
        {
          label: '이용기간',
          value: props.passPeriod
            ? `${formatPaymentDateTime(props.passPeriod.startedAt)} ~ ${formatPaymentDateTime(props.passPeriod.expiresAt)}`
            : '이용 기간 확인 불가',
        },
        {
          label: '환불금액',
          value: `₩ ${props.amount.toLocaleString('ko-KR')}`,
          emphasis: 'red',
        },
      ];
      break;
    case 'refund-success':
      rows = [
        {
          label: '환불 금액',
          value: `${props.amount.toLocaleString('ko-KR')}원`,
        },
        { label: '주문번호', value: props.orderNumber },
      ];
      break;
    case 'refund-pending':
      description = (
        <>
          결제사 확인이 늦어지고 있어요.
          <br />
          결제 내역에서 환불 상태를 다시 확인해 주세요.
        </>
      );
      break;
    case 'refund-failed':
      description =
        props.failureMessage || '계속 실패하면 주문번호와 함께 문의해 주세요.';
      rows = [{ label: '주문번호', value: props.orderNumber }];
      actions = {
        secondary: {
          label: '홈으로',
          onClick: props.onHome,
          disabled: isRetrying,
        },
        primary: {
          label: isRetrying ? '확인 중...' : '다시 시도하기',
          onClick: props.onRetry,
          disabled: isRetrying,
        },
      };
      break;
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
          label: props.onContact
            ? '고객문의 = 카카오채널(@COZE)'
            : '고객문의 준비 중',
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
        {props.status === 'refund-confirm' ? (
          <img src={passImage} alt="" className="size-28 object-contain" />
        ) : isWaiting ? (
          <LoaderCircle
            aria-hidden="true"
            className={`size-12 text-blue-60 ${isChecking || props.status === 'refund-pending' ? 'animate-spin motion-reduce:animate-none' : ''}`}
            strokeWidth={1.5}
          />
        ) : (
          <img
            src={
              props.status === 'success' || props.status === 'refund-success'
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
      {(props.status === 'failed' || props.status === 'refund-failed') && (
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
      {props.status === 'refund-confirm' && (
        <>
          <p
            role={isRetrying ? 'status' : undefined}
            className={`mt-3 text-center text-xs leading-5 ${isRetrying ? 'text-blue-60' : 'text-gray-50'}`}
          >
            {isRetrying
              ? '환불을 요청하고 있어요. 창을 닫지 마세요.'
              : '카드사에 따라 실제 취소는 3~7영업일 걸릴 수 있습니다.'}
          </p>
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={props.onClose}
              disabled={isRetrying}
              className="min-h-14 min-w-0 flex-1 cursor-pointer rounded-xl border border-gray-20 px-3 text-gray-40 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={props.onRetry}
              disabled={isRetrying || !PAYMENT_ENABLED}
              className="flex min-h-14 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-55 px-3 font-semibold text-red-55 disabled:cursor-wait disabled:bg-red-02"
            >
              {isRetrying && (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-5 animate-spin motion-reduce:animate-none"
                />
              )}
              {isRetrying ? '처리중' : '환불하기'}
            </button>
          </div>
          {!PAYMENT_ENABLED && (
            <p className="mt-3 text-center text-xs text-gray-60">
              {PAYMENT_DISABLED_MESSAGE}
            </p>
          )}
        </>
      )}
      {(props.status === 'refund-success' ||
        props.status === 'refund-pending') && (
        <button
          type="button"
          onClick={props.onClose}
          className="mx-auto mt-7 block min-h-14 w-36 cursor-pointer rounded-xl border border-gray-20 font-semibold text-gray-40"
        >
          확인
        </button>
      )}
      {actions && <PaymentModalActions {...actions} />}
      {props.status === 'success' && (
        <button
          type="button"
          onClick={props.onConfirm}
          className="mt-7 min-h-14 w-full cursor-pointer rounded-xl bg-blue-60 px-4 py-3 text-base font-semibold text-white"
        >
          확인
        </button>
      )}
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
