import { useEffect, useId, useRef } from 'react';
import catImage from '../../../assets/character/basic_pose_cat.svg';
import type { StreakDayData } from '../../../types/streak';
import StreakWeek from './StreakWeek';

interface StreakRecoveryCompleteModalProps {
  streakDays: number;
  days: StreakDayData[];
  restoredDate: string;
  stockBefore: number | null;
  stockAfter: number | null;
  requestedBeforeLearning: boolean;
  onShown: () => void;
  onClose: () => void;
}

const StreakRecoveryCompleteModal = ({
  streakDays,
  days,
  restoredDate,
  stockBefore,
  stockAfter,
  requestedBeforeLearning,
  onShown,
  onClose,
}: StreakRecoveryCompleteModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const shown = useRef(onShown);
  const dateLabel = new Date(`${restoredDate}T00:00:00Z`).toLocaleDateString(
    'ko-KR',
    { timeZone: 'UTC', month: 'numeric', day: 'numeric', weekday: 'long' }
  );

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    if (dialog?.open) shown.current();
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
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-90 overflow-y-auto rounded-2xl border-0 bg-white p-6 backdrop:bg-black/30"
    >
      <span className="inline-block rounded-md border border-blue-60 px-2 py-2 text-[10px] font-semibold text-blue-60">
        복구 완료
      </span>
      <div className="-mt-6 flex flex-col items-center text-center">
        <div className="size-32 shrink-0 overflow-hidden rounded-full">
          <img
            src={catImage}
            alt="다시 돌아온 고양이"
            className="size-full object-cover"
          />
        </div>
        <p className="relative -mt-0.5 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-white">
          다시 이어졌다 냥!
        </p>
        <p className="mt-4 text-4xl font-bold text-yellow-45">{streakDays}일</p>
        <h2 id={titleId} className="mt-1 text-sm font-bold">
          연속 학습을 지켰어요
        </h2>
        <p className="mt-1 text-[11px] leading-5 text-gray-60">
          {dateLabel} 기록을 이어 붙였어요.
        </p>
      </div>
      <div className="mx-auto mt-4 w-full max-w-56 [&_ul]:gap-1">
        <StreakWeek days={days} />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-blue-15 px-3 py-4">
        <div className="shrink-0">
          <p className="text-[12px] text-gray-40">
            {requestedBeforeLearning ? '복구 신청 전 → 복구 후' : '주가 복구'}
          </p>
          <p className=" text-[16px] text-gray-60">
            {stockBefore?.toFixed(2) ?? '-'}{' '}
            <span className="mx-1 text-gray-20">→</span>{' '}
            <strong className="text-[20px] text-blue-50">
              {stockAfter?.toFixed(2) ?? '-'}
            </strong>
          </p>
        </div>
        <div className="text-[12px] leading-5">
          <p className="font-semibold text-blue-60">
            떨어졌던 주가를 되돌렸어요
          </p>
          <p className="text-gray-60">사라졌던 효과도 돌아왔어요</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-6 block h-12 w-32 cursor-pointer rounded-xl bg-blue-60 text-sm font-semibold text-white"
      >
        확인
      </button>
    </dialog>
  );
};

export default StreakRecoveryCompleteModal;
