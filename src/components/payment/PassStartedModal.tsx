import { useId } from 'react';
import { Check } from 'lucide-react';
import passImage from '../../assets/store/Pass_Big.svg';
import { formatPaymentDateTime } from '../../utils/paymentFormat';
import PaymentModalFrame, { PaymentModalActions } from './PaymentModalFrame';

interface PassStartedModalProps {
  passPeriod: { startedAt: string; expiresAt: string } | null;
  isLoadingPeriod: boolean;
  onRetry: () => void;
  onClose: () => void;
  onQuiz: () => void;
}

const PassStartedModal = ({
  passPeriod,
  isLoadingPeriod,
  onRetry,
  onClose,
  onQuiz,
}: PassStartedModalProps) => {
  const titleId = useId();
  return (
    <PaymentModalFrame titleId={titleId} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <img src={passImage} alt="" className="size-28 object-contain" />
        <h2 id={titleId} className="mt-6 text-xl font-bold">
          일주일 패스가 시작됐어요
        </h2>
        {passPeriod ? (
          <dl className="mt-4 space-y-2 text-sm text-blue-60">
            {[
              { label: '시작', value: passPeriod.startedAt },
              { label: '만료', value: passPeriod.expiresAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <dt className="rounded-full border border-gray-20 px-3 py-2 font-semibold">
                  {label}
                </dt>
                <dd>{formatPaymentDateTime(value)}</dd>
              </div>
            ))}
          </dl>
        ) : isLoadingPeriod ? (
          <p role="status" className="mt-4 text-sm text-gray-60">
            패스 이용 기간을 확인하고 있어요.
          </p>
        ) : (
          <div className="mt-4 text-sm text-gray-60">
            <p role="alert">패스 이용 기간을 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 cursor-pointer text-blue-60 underline underline-offset-2"
            >
              다시 확인
            </button>
          </div>
        )}
      </div>
      <ul className="mx-auto mt-6 w-fit space-y-4 text-sm leading-6 text-gray-80">
        <li className="flex items-start gap-3">
          <Check
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 rounded-full bg-blue-60 p-0.5 text-white"
          />
          <span>
            주가 상승 기회{' '}
            <strong className="font-semibold text-blue-60">하루 15문제</strong>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 rounded-full bg-blue-60 p-0.5 text-white"
          />
          <span>
            정규장·시간외거래 입장{' '}
            <strong className="font-semibold text-blue-60">
              FISH 차감 없음
            </strong>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Check
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 rounded-full bg-blue-60 p-0.5 text-white"
          />
          <span>
            연속 학습 중단 시{' '}
            <strong className="font-semibold text-blue-60">무료 복구</strong>
          </span>
        </li>
      </ul>
      <PaymentModalActions
        secondary={{ label: '확인', onClick: onClose }}
        primary={{ label: '퀴즈 풀러 가기', onClick: onQuiz }}
      />
    </PaymentModalFrame>
  );
};

export default PassStartedModal;
