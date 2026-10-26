import recoveryImage from '../../assets/store/Recover_Ticket_Orange.svg';

interface RecoveryProductCardProps {
  ownedCount?: number;
  fishPrice?: number;
  disabled?: boolean;
  isPurchasing?: boolean;
  onPurchase?: () => void;
}

const RecoveryProductCard = ({ ownedCount, fishPrice, disabled = true, isPurchasing = false, onPurchase }: RecoveryProductCardProps) => (
  <article className="flex flex-col gap-8 rounded-3xl border border-gray-20 bg-white p-6 sm:flex-row sm:items-center lg:gap-12 lg:p-9">
    <div className="flex w-44 shrink-0 justify-center self-center lg:w-48">
      <div className="size-30 rounded-3xl bg-yellow-05">
        <img src={recoveryImage} alt="주황색 연속 학습 복구권" className="size-full object-contain p-2" />
      </div>
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-bold text-black">연속 학습 복구권</h3>
        <span className="rounded bg-gray-05 px-2 py-1 text-xs font-semibold text-gray-60">보유 {ownedCount ?? '-'}개</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-gray-60">
        연속학습 중단 다음 날에만 복구 가능<br />사용 후 환불 불가
      </p>
    </div>
    <button type="button" disabled={disabled} onClick={onPurchase} className="h-16 w-36 shrink-0 cursor-pointer disabled:cursor-not-allowed self-end rounded-xl border border-blue-60 bg-white text-xl font-bold text-blue-60 sm:self-center">
      {isPurchasing ? '구매 중...' : `FISH ${fishPrice ?? '-'}`}
    </button>
  </article>
);

export default RecoveryProductCard;
