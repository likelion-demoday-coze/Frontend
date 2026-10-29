import { useId } from 'react';
import recoveryImage from '../../assets/store/Recover_Ticket_Orange.svg';
import PaymentModalFrame from '../payment/PaymentModalFrame';

interface RecoveryPurchaseCompleteModalProps {
  ownedCount: number;
  onClose: () => void;
}

const RecoveryPurchaseCompleteModal = ({
  ownedCount,
  onClose,
}: RecoveryPurchaseCompleteModalProps) => {
  const titleId = useId();
  return (
    <PaymentModalFrame titleId={titleId} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <img src={recoveryImage} alt="" className="size-28 object-contain" />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <h2 id={titleId} className="text-xl font-bold">
            복구권 교환 완료
          </h2>
          <span className="rounded-lg bg-gray-05 px-2 py-1.5 text-sm font-semibold text-gray-60">
            보유 {ownedCount.toLocaleString('ko-KR')}개
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-60">
          연속 학습이 끊기면 다음 날 23:59까지 쓸 수 있어요.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 min-h-14 w-40 cursor-pointer rounded-xl border border-gray-20 px-4 py-3 text-base font-semibold text-gray-40"
        >
          확인
        </button>
      </div>
    </PaymentModalFrame>
  );
};

export default RecoveryPurchaseCompleteModal;
