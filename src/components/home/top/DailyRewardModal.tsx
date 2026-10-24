import { useEffect, useId, useRef } from 'react';
import fishImage from '../../../assets/store/Fish_Bunddle 1.svg';

interface DailyRewardModalProps {
  amount: number;
  onClose: () => void;
  onQuiz: () => void;
}

const DailyRewardModal = ({
  amount,
  onClose,
  onQuiz,
}: DailyRewardModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
        onClose();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-103 rounded-[20px] border-0 bg-white px-9 py-6 backdrop:bg-black/30"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex size-28 items-center justify-center rounded-full bg-blue-05">
          <img src={fishImage} alt="" className="size-28 object-contain" />
        </div>
        <p className="mt-2 rounded-full bg-blue-50 px-3 py-1.5 text-base font-semibold text-white">
          오늘의 생선이다 냥!
        </p>
        <h2
          id={titleId}
          className="mt-5 text-xl font-bold break-keep text-black"
        >
          오늘의 생선 {amount}개를 받았어요
        </h2>
        <p className="mt-1 text-sm break-keep text-gray-60">
          정규장 2번, 시간외거래 1번을 풀 수 있어요.
        </p>
        <div className="mt-5 flex w-full gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-15 flex-1 cursor-pointer rounded-xl border border-gray-10 bg-white text-lg font-semibold text-gray-40"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onQuiz}
            className="h-15 flex-1 cursor-pointer rounded-xl bg-blue-60 text-lg font-semibold text-white"
          >
            퀴즈 풀러가기
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DailyRewardModal;
