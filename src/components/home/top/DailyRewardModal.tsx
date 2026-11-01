import { useEffect, useId, useRef } from 'react';
import fishImage from '../../../assets/store/Fish_Bunddle 1.svg';
import { useBlockRankingReward } from '../../../hooks/useRankingRewardGate';

interface DailyRewardModalProps {
  amount: number;
  variant?: 'daily' | 'signup';
  attendanceAmount?: number;
  isSubmitting?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onQuiz: () => void;
}

const DailyRewardModal = ({
  amount,
  variant = 'daily',
  attendanceAmount = 100,
  isSubmitting = false,
  errorMessage,
  onClose,
  onQuiz,
}: DailyRewardModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isSignup = variant === 'signup';
  useBlockRankingReward(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      aria-busy={isSubmitting}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-103 overflow-y-auto rounded-[20px] border-0 bg-white px-9 py-6 backdrop:bg-black/30"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex size-28 items-center justify-center rounded-full bg-blue-05">
          <img src={fishImage} alt="" className="size-28 object-contain" />
        </div>
        <p className="mt-2 rounded-full bg-blue-50 px-3 py-1.5 text-base font-semibold text-white">
          {isSignup ? '가입을 축하한다 냥!' : '오늘의 생선이다 냥!'}
        </p>
        <h2
          id={titleId}
          className="mt-5 text-xl font-bold break-keep text-black"
        >
          {isSignup ? '가입 기념' : '오늘의'} FISH {amount}개를 받았어요
        </h2>
        <p className="mt-1 text-sm break-keep text-gray-60">
          {isSignup
            ? `출석 보상까지 받으면 FISH ${amount + attendanceAmount}개로 시작해요`
            : '정규장 2번, 시간외거래 1번을 풀 수 있어요.'}
        </p>
        {errorMessage && (
          <p role="alert" className="mt-3 text-sm break-words text-red-55">
            {errorMessage}
          </p>
        )}
        <div className="mt-5 flex w-full gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-15 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white text-lg font-semibold text-gray-40 disabled:cursor-wait disabled:opacity-50"
          >
            {isSubmitting ? '확인 중...' : '닫기'}
          </button>
          <button
            type="button"
            onClick={onQuiz}
            disabled={isSubmitting}
            className="h-15 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white disabled:cursor-wait disabled:opacity-50"
          >
            퀴즈 풀러가기
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DailyRewardModal;
