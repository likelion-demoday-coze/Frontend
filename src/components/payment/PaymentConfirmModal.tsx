import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { PaymentProduct } from '../../types/payment';
import {
  PAYMENT_ENABLED,
  PAYMENT_DISABLED_MESSAGE,
} from '../../constants/payment';
import PaymentModalFrame from './PaymentModalFrame';
import PaymentSummary from './PaymentSummary';
import CrossIcon from '../../assets/signup/cross.svg?react';

interface PaymentConfirmModalProps {
  product: Pick<PaymentProduct, 'name' | 'price' | 'passDurationHours'>;
  onClose: () => void;
  onConfirm: (receiverPhone: string) => void | Promise<void>;
  onOpenTerms?: () => void;
  onOpenRefundPolicy?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  paymentMethodLabel?: string;
}

const PaymentConfirmModal = ({
  product,
  onClose,
  onConfirm,
  onOpenTerms,
  onOpenRefundPolicy,
  isSubmitting = false,
  errorMessage,
  paymentMethodLabel = '신용·체크카드',
}: PaymentConfirmModalProps) => {
  const id = useId();
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const lock = useRef(false);
  const validPhone = /^010\d{8}$/.test(phone);
  const busy = isSubmitting || submitting;
  const canSubmit = PAYMENT_ENABLED && validPhone && agreed && !busy;
  const amountLabel = `${product.price.toLocaleString('ko-KR')}원`;
  const durationLabel = `${product.passDurationHours}시간${product.passDurationHours % 24 === 0 ? `(${product.passDurationHours / 24}일)` : ''}`;
  const phoneError = phoneTouched && !validPhone;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || lock.current) return;
    lock.current = true;
    setSubmitting(true);
    setSubmitError('');
    try {
      await onConfirm(phone);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : '결제 요청에 실패했어요. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      lock.current = false;
      setSubmitting(false);
    }
  };

  return (
    <PaymentModalFrame titleId={`${id}-title`} onClose={onClose} isBusy={busy}>
      <h2 id={`${id}-title`} className="text-center text-lg font-bold">
        결제 확인
      </h2>
      <PaymentSummary
        rows={[
          { label: '상품', value: product.name, emphasis: 'blue' },
          {
            label: '이용 기간',
            value: `결제 승인 시각부터 ${product.passDurationHours}시간`,
          },
          { label: '결제 수단', value: paymentMethodLabel },
          { label: '결제 금액', value: amountLabel, emphasis: 'blue' },
        ]}
      />
      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor={`${id}-phone`} className="text-sm font-semibold">
          휴대전화 번호(필수)
        </label>
        <input
          id={`${id}-phone`}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required
          value={phone}
          disabled={busy}
          placeholder="01012345678"
          onChange={(event) => {
            setPhone(event.target.value.replace(/\D/g, '').slice(0, 11));
            setSubmitError('');
          }}
          onBlur={() => setPhoneTouched(true)}
          aria-invalid={phoneError}
          aria-describedby={`${id}-phone-help`}
          className={`mt-2 h-12 w-full rounded-xl border px-4 text-base outline-none focus:border-blue-60 disabled:bg-gray-05 ${phoneError ? 'border-red-55' : 'border-gray-20'}`}
        />
        <p
          id={`${id}-phone-help`}
          className={`mt-2 flex items-center gap-1 text-xs leading-5 ${phoneError ? 'text-red-55' : 'text-gray-60'}`}
        >
          {phoneError && <CrossIcon aria-hidden="true" className="size-3 shrink-0 text-red-55" />}
          {phoneError
            ? '휴대폰 번호를 정확히 입력해주세요.'
            : '결제 안내를 위해 페이앱에 전달돼요.'}
        </p>
        <div className="mt-4 rounded-xl border border-gray-20 p-4">
          <label className="flex cursor-pointer items-start gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={agreed}
              required
              disabled={busy}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-blue-60"
            />
            <span>[필수] 아래 내용을 확인했어요</span>
          </label>
          <ul className="mt-3 space-y-1 pl-6 text-[11px] leading-5 text-gray-60">
            <li>결제가 승인된 시각부터 {durationLabel} 동안 이용해요.</li>
            <li className="text-blue-60 font-semibold">
              자동으로 다시 결제되지 않아요.
            </li>
            <li>결제 즉시 효력이 발생해요.</li>
            <li>이용 중에는 추가 구매할 수 없어요. 만료 후 재구매 가능해요.</li>
            <li>미사용 재화 환불은 환불 정책에 따라 처리돼요.</li>
            <li>베타 서비스로 운영 종료 후 데이터가 소멸될 수 있어요.</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 pl-6 text-[11px] font-semibold text-blue-60">
            <button
              type="button"
              onClick={onOpenTerms}
              disabled={busy || !onOpenTerms}
              className="cursor-pointer underline underline-offset-2"
            >
              {onOpenTerms ? '이용약관 보기 ›' : '이용약관 준비 중'}
            </button>
            <button
              type="button"
              onClick={onOpenRefundPolicy}
              disabled={busy || !onOpenRefundPolicy}
              className="cursor-pointer underline underline-offset-2"
            >
              {onOpenRefundPolicy ? '환불 정책 보기 ›' : '환불 정책 준비 중'}
            </button>
          </div>
        </div>
        {!PAYMENT_ENABLED && (
          <p role="status" className="mt-3 text-xs text-gray-60">
            {PAYMENT_DISABLED_MESSAGE}
          </p>
        )}
        {(submitError || errorMessage) && (
          <p role="alert" className="mt-3 text-xs leading-5 text-red-55">
            {submitError || errorMessage}
          </p>
        )}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="min-h-14 flex-1 cursor-pointer rounded-xl border border-gray-20 px-3 py-3 text-sm font-semibold text-gray-40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="min-h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-10 disabled:text-gray-60 sm:text-base"
          >
            {busy ? '결제 요청 중...' : `${amountLabel} 결제하기`}
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-gray-60">
          결제는 페이앱 결제창에서 진행돼요
        </p>
      </form>
    </PaymentModalFrame>
  );
};

export default PaymentConfirmModal;
