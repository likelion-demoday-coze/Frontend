import { useEffect, useId, useRef, useState } from 'react';
import passImage from '../../../assets/store/Pass_Big.svg';
import { PASS_SALES_END_AT } from '../../../constants/pass';

interface PassNotificationProps {
  onClose: () => void;
  onHideToday: () => void;
  onViewPass: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const saleEndMs = PASS_SALES_END_AT.getTime();
const saleEndKst = new Date(saleEndMs + KST_OFFSET_MS);
const deadlineLabel = `${saleEndKst.getUTCMonth() + 1}/${saleEndKst.getUTCDate()}(${['일', '월', '화', '수', '목', '금', '토'][saleEndKst.getUTCDay()]}) ${String(saleEndKst.getUTCHours()).padStart(2, '0')}:${String(saleEndKst.getUTCMinutes()).padStart(2, '0')}`;

const PassNotification = ({
  onClose,
  onHideToday,
  onViewPass,
  isSubmitting = false,
  errorMessage = '',
}: PassNotificationProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [now, setNow] = useState(Date.now);
  const saleEnded = now >= saleEndMs;
  const remainingDays = Math.max(
    0,
    Math.floor((saleEndMs + KST_OFFSET_MS) / DAY_MS) -
      Math.floor((now + KST_OFFSET_MS) / DAY_MS)
  );
  const badge = saleEnded
    ? '패스 판매 종료'
    : `패스 판매 ${remainingDays === 0 ? 'D-DAY' : `D-${remainingDays}`}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(timer);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={isSubmitting}
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-103 overflow-y-auto rounded-3xl border-0 bg-white px-6 pt-6 pb-5 backdrop:bg-black/30 sm:px-8"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex size-28 shrink-0 items-center justify-center rounded-full bg-blue-05">
          <img src={passImage} alt="" className="size-full object-contain" />
        </div>
        <p className="relative rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-white sm:text-base">
          {badge}
        </p>
        <h2
          id={titleId}
          className="mt-6 text-[19px] leading-snug font-bold break-keep text-black sm:text-xl"
        >
          {saleEnded ? '패스 판매가 종료됐어요' : '패스 판매가 곧 끝나요!'}
        </h2>
        <p
          id={descriptionId}
          className="mt-2 text-sm leading-6 break-keep text-gray-60"
        >
          {saleEnded
            ? `${deadlineLabel}에 판매가 마감됐어요.`
            : `${deadlineLabel}까지만 살 수 있어요.`}
        </p>
        <ul className="mt-5 space-y-1.5 text-left text-sm leading-6 font-semibold text-gray-60">
          {[
            '입장 FISH 차감 없음',
            '정규장 주가 반영 하루 3회',
            '연속 학습 무료 복구',
          ].map((benefit) => (
            <li key={benefit} className="flex items-start gap-1.5">
              <span aria-hidden="true" className="shrink-0">
                🐾
              </span>
              <span className="break-keep">{benefit}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onViewPass}
          disabled={isSubmitting || saleEnded}
          className="mt-6 flex min-h-15 w-full cursor-pointer items-center justify-center rounded-xl bg-blue-60 px-3 py-3 text-base font-bold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-60 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
        >
          {saleEnded ? '판매 종료' : '패스 보러 가기'}
        </button>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-4 text-center text-sm text-red-55">
          {errorMessage}
        </p>
      )}
      <div className="mt-7 flex items-center border-t border-gray-20 pt-4 text-sm text-gray-40">
        <button
          type="button"
          onClick={onHideToday}
          disabled={isSubmitting}
          className="min-h-10 min-w-0 flex-1 cursor-pointer px-1 hover:text-gray-60 disabled:cursor-wait disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '오늘 하루 보지 않기'}
        </button>
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-gray-20" />
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="min-h-10 min-w-0 flex-1 cursor-pointer px-1 hover:text-gray-60 disabled:cursor-wait disabled:opacity-50"
        >
          닫기
        </button>
      </div>
    </dialog>
  );
};

export default PassNotification;
