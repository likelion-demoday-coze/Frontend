import { useEffect, useId } from 'react';
import type { QuizAttempt } from '../../hooks/useQuizEntryStatus';

interface StartConfirmModalProps {
  categoryLabel: string;
  fishCost: number;
  fishBalance: number;
  isPass: boolean;
  attempt: QuizAttempt;
  onClose: () => void;
  onStart: () => void;
  onCharge: () => void;
}

//정규장 시작 모달
const StartConfirmModal = ({
  categoryLabel,
  fishCost,
  fishBalance,
  isPass,
  attempt,
  onClose,
  onStart,
  onCharge,
}: StartConfirmModalProps) => {
  const titleId = useId();
  const isFishShort = !isPass && fishBalance < fishCost;
  const isExhausted = attempt.used >= attempt.limit;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const primary = isFishShort
    ? { label: '생선 충전하기', onClick: onCharge }
    : { label: isExhausted ? '학습만 하기' : '시작하기', onClick: onStart };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-80/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-110 flex-col items-center rounded-3xl bg-white px-6 pt-8 pb-8 shadow-[0_6px_0_rgba(0,0,0,0.12)] lg:px-8 lg:pb-9"
      >
        {/*TODO: 아이콘 디자인 나오면 교체*/}
        <span aria-hidden="true" className="size-16 rounded-2xl bg-blue-05" />
        <h2
          id={titleId}
          className="mt-4 text-center text-lg font-bold break-keep text-gray-80 lg:text-xl"
        >
          '{categoryLabel}' 카테고리로 시작할까요?
        </h2>
        <p className="mt-1.5 text-sm text-gray-50">
          오늘의 정규장 5문제가 출제돼요.
        </p>

        <dl className="mt-6 flex w-full flex-col rounded-xl bg-gray-05 px-4 text-sm font-bold">
          <div className="flex items-center justify-between gap-2 border-b border-gray-10 py-3.5">
            <dt className="text-gray-50">생선</dt>
            <dd className="flex items-center gap-2 text-right">
              {isPass ? (
                <>
                  <span className="rounded-full bg-blue-60 px-3 py-1 text-[11px] text-white">
                    PASS
                  </span>
                  <span className="text-blue-60">패스 사용 중 · 차감 없음</span>
                </>
              ) : isFishShort ? (
                <span className="text-red-55">
                  보유 {fishBalance} · {fishCost - fishBalance}개가 부족해요
                </span>
              ) : (
                <span className="text-gray-80">
                  {fishCost} FISH 사용 · 보유 {fishBalance} →{' '}
                  {fishBalance - fishCost}
                </span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-3.5">
            <dt className="text-gray-50">주가 반영</dt>
            <dd className="text-right">
              {isExhausted ? (
                <span className="text-[#c46a00]">
                  오늘 {attempt.limit}/{attempt.limit}회 모두 사용
                </span>
              ) : (
                <span className="text-blue-60">
                  오늘 {attempt.used + 1}/{attempt.limit}회차 · 반영돼요
                </span>
              )}
            </dd>
          </div>
        </dl>

        {isExhausted && !isFishShort && (
          <p
            role="alert"
            className="mt-3 w-full rounded-xl bg-yellow-05 px-4 py-3.5 text-[13px] font-bold text-[#c46a00]"
          >
            ⚠ 이번 풀이는 주가에 반영되지 않아요
          </p>
        )}

        <div className="mt-6 flex w-full gap-3">
          {/*TODO: 공통 Button 컴포넌트가 생기면 교체*/}
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 cursor-pointer rounded-xl border border-gray-20 bg-white text-base font-bold text-gray-50"
          >
            다시 고르기
          </button>
          <button
            type="button"
            onClick={primary.onClick}
            autoFocus
            className="h-14 flex-1 cursor-pointer rounded-xl bg-blue-60 text-base font-bold text-white"
          >
            {primary.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartConfirmModal;
